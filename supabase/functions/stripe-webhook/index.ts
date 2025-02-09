
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

serve(async (req) => {
  // Log all headers for debugging
  console.log('Received headers:', Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Get raw body and log it
    const rawBody = await req.text();
    console.log('Received webhook payload:', rawBody);

    // Get Stripe signature (try different casings)
    const signature = 
      req.headers.get('stripe-signature') || 
      req.headers.get('Stripe-Signature');

    console.log('Stripe signature:', signature);

    if (!signature) {
      console.error('No Stripe signature found in headers');
      return new Response(
        JSON.stringify({ 
          error: 'No Stripe signature found',
          headers: Object.fromEntries(req.headers.entries())
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeKey || !webhookSecret) {
      console.error('Missing Stripe configuration:', {
        hasStripeKey: !!stripeKey,
        hasWebhookSecret: !!webhookSecret
      });
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      console.log('Webhook verified successfully, event:', {
        type: event.type,
        id: event.id
      });
    } catch (err) {
      console.error('Webhook signature verification failed:', {
        error: err.message,
        signature: signature,
        bodyLength: rawBody.length
      });
      return new Response(
        JSON.stringify({ 
          error: 'Invalid signature',
          details: err.message
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing completed checkout session:', {
        sessionId: session.id,
        customerId: session.customer,
        paymentStatus: session.payment_status
      });

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase configuration');
        throw new Error('Missing Supabase configuration');
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Update competition entry
      const { error: updateError } = await supabaseAdmin.rpc(
        'handle_stripe_payment_success',
        { payment_session_id: session.id }
      );

      if (updateError) {
        console.error('Error updating competition entry:', updateError);
        throw updateError;
      }

      console.log('Successfully processed payment for session:', session.id);
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
    console.error('Webhook processing error:', {
      message: error.message,
      stack: error.stack
    });
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: 'internal_server_error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
