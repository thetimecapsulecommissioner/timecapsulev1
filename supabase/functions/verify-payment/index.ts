
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
    console.log('Starting payment verification process...');
    const { sessionId, competitionId, userId } = await req.json();
    console.log('Received verification request:', { sessionId, competitionId, userId });

    if (!sessionId || !competitionId || !userId) {
      console.error('Missing required parameters:', { sessionId, competitionId, userId });
      throw new Error('Missing required parameters');
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('Stripe configuration missing');
      throw new Error('Stripe configuration missing');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    console.log('Retrieving Stripe session...');
    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Stripe session retrieved:', {
      status: session.payment_status,
      metadata: session.metadata
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      throw new Error('Supabase configuration missing');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the session is paid
    if (session.payment_status === 'paid') {
      console.log('Payment is confirmed paid. Updating competition entry...');
      
      // Update competition entry
      const { error: updateError } = await supabaseAdmin
        .from('competition_entries')
        .update({ 
          payment_completed: true,
          terms_accepted: true,
          status: 'In Progress',
          testing_mode: false
        })
        .eq('user_id', userId)
        .eq('competition_id', competitionId);

      if (updateError) {
        console.error('Error updating competition entry:', updateError);
        throw updateError;
      }
      
      console.log('Competition entry updated successfully');
      
      return new Response(
        JSON.stringify({ 
          paymentCompleted: true,
          status: session.payment_status
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // If payment is not paid, return current status
    return new Response(
      JSON.stringify({ 
        paymentCompleted: false,
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
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
