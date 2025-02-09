
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  // Log request details
  console.log('Webhook Request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Get raw body
    const rawBody = await req.text();
    console.log('Request body length:', rawBody.length);

    // Get and validate Stripe configuration
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Validate all required configuration
    const configCheck = {
      hasStripeKey: !!stripeKey,
      hasWebhookSecret: !!webhookSecret,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseServiceKey
    };

    console.log('Configuration check:', configCheck);

    if (!stripeKey || !webhookSecret) {
      throw new Error('Missing Stripe configuration');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    // Get Stripe signature (try multiple header variations)
    const signature = 
      req.headers.get('stripe-signature') || 
      req.headers.get('Stripe-Signature');

    if (!signature) {
      console.error('No Stripe signature found in request headers');
      throw new Error('No Stripe signature found');
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      console.log('Event verified successfully:', {
        type: event.type,
        id: event.id
      });
    } catch (err) {
      console.error('Signature verification failed:', {
        error: err.message,
        signature: signature?.substring(0, 20) + '...',
        bodyLength: rawBody.length
      });
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Log session details
      console.log('Processing checkout session:', {
        id: session.id,
        customer: session.customer_email,
        paymentStatus: session.payment_status,
        metadata: session.metadata,
        amount: session.amount_total,
        currency: session.currency
      });

      if (session.payment_status !== 'paid') {
        console.error('Payment status is not paid:', session.payment_status);
        throw new Error('Payment not completed successfully');
      }

      // Extract user_id and competition_id from metadata
      const { user_id, competition_id } = session.metadata;
      
      if (!user_id || !competition_id) {
        console.error('Missing metadata:', session.metadata);
        throw new Error('Missing required metadata');
      }

      // Update competition entry
      const { error: updateError } = await supabaseAdmin
        .from('competition_entries')
        .update({ 
          payment_completed: true,
          terms_accepted: true,
          status: 'In Progress',
          payment_session_id: session.id
        })
        .eq('user_id', user_id)
        .eq('competition_id', competition_id);

      if (updateError) {
        console.error('Error updating competition entry:', updateError);
        throw updateError;
      }

      console.log('Successfully processed payment for session:', {
        sessionId: session.id,
        userId: user_id,
        competitionId: competition_id
      });
    }

    // Return success response
    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    // Log the full error details
    console.error('Webhook error:', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name
    });

    // Return error response
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: error.constructor.name
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
