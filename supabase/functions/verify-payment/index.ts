
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
    console.log('Received verification request with details:', { 
      sessionId: sessionId ? 'present' : 'missing',
      competitionId: competitionId ? 'present' : 'missing',
      userId: userId ? 'present' : 'missing'
    });

    if (!sessionId || !competitionId || !userId) {
      const missingParams = {
        sessionId: !sessionId,
        competitionId: !competitionId,
        userId: !userId
      };
      console.error('Missing required parameters:', missingParams);
      throw new Error(`Missing required parameters: ${Object.entries(missingParams)
        .filter(([_, missing]) => missing)
        .map(([param]) => param)
        .join(', ')}`);
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('Stripe configuration missing');
      throw new Error('Stripe configuration missing');
    }

    console.log('Initializing Stripe with valid key');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    console.log('Attempting to retrieve Stripe session:', sessionId);
    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Stripe session details:', {
      id: session.id,
      status: session.payment_status,
      customer: session.customer,
      metadata: session.metadata,
      amountTotal: session.amount_total,
      currency: session.currency
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      throw new Error('Supabase configuration missing');
    }

    console.log('Initializing Supabase admin client');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the session is paid
    if (session.payment_status === 'paid') {
      console.log('Payment confirmed as paid. Proceeding to update competition entry.');
      console.log('Updating entry for:', { userId, competitionId });
      
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
        console.error('Error updating competition entry:', {
          error: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
        throw updateError;
      }
      
      console.log('Competition entry successfully updated with payment confirmation');
      
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

    console.log('Payment not yet confirmed. Current status:', session.payment_status);
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
    console.error('Error in payment verification:', {
      message: error.message,
      stack: error.stack,
      details: error.toString()
    });
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
