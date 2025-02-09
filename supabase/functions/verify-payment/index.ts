
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, competitionId, userId } = await req.json();

    if (!sessionId || !competitionId || !userId) {
      throw new Error('Missing required parameters');
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe configuration missing');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify the session is paid and matches our records
    const isValidPayment = 
      session.payment_status === 'paid' && 
      session.metadata?.competition_id === competitionId &&
      session.metadata?.user_id === userId;

    if (isValidPayment) {
      // Initialize Supabase admin client
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase configuration missing');
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Update competition entry
      const { error: updateError } = await supabaseAdmin
        .from('competition_entries')
        .update({ 
          payment_completed: true,
          terms_accepted: true,
          status: 'In Progress'
        })
        .eq('user_id', userId)
        .eq('competition_id', competitionId);

      if (updateError) {
        throw updateError;
      }
    }

    return new Response(
      JSON.stringify({ 
        paymentCompleted: isValidPayment,
        status: session.payment_status
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
