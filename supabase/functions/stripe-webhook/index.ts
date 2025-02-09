
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  console.log('Stripe webhook function invoked with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Log complete request details for debugging
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('All headers:', Object.fromEntries(req.headers.entries()));
    
    // Verify it's a POST request
    if (req.method !== 'POST') {
      console.error('Invalid method:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('Missing Stripe secret key');
      throw new Error('Configuration error');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    // Check raw stripe-signature header
    const rawSig = req.headers.get('stripe-signature');
    console.log('Raw Stripe signature:', rawSig);

    // Check all possible header variations
    console.log('Stripe-Signature header:', req.headers.get('Stripe-Signature'));
    console.log('stripe-signature header:', req.headers.get('stripe-signature'));
    console.log('STRIPE-SIGNATURE header:', req.headers.get('STRIPE-SIGNATURE'));

    const signature = req.headers.get('stripe-signature') || 
                     req.headers.get('Stripe-Signature') || 
                     req.headers.get('STRIPE-SIGNATURE');

    if (!signature) {
      console.error('No Stripe signature found in request headers');
      return new Response(
        JSON.stringify({ 
          error: 'No signature provided',
          headers: Object.fromEntries(req.headers.entries())
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('Missing Stripe webhook secret');
      throw new Error('Configuration error');
    }

    console.log('Webhook secret exists, proceeding to verify signature');

    const body = await req.text();
    console.log('Received webhook body:', body);
    
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Webhook event constructed successfully:', event.type);
    } catch (err) {
      console.error('Error verifying webhook signature:', err.message);
      return new Response(
        JSON.stringify({ 
          error: 'Webhook signature verification failed', 
          details: err.message,
          receivedSignature: signature,
          headerKeys: Array.from(req.headers.keys())
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing successful checkout session:', session.id);

      // Log the metadata for debugging
      console.log('Session metadata:', session.metadata);

      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase configuration');
        throw new Error('Configuration error');
      }

      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.7.1');
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Update the competition entry for the user
      const { data, error } = await supabaseAdmin.rpc(
        'handle_stripe_payment_success',
        { payment_session_id: session.id }
      );

      if (error) {
        console.error('Error updating competition entry:', error);
        throw error;
      }

      console.log('Successfully processed payment for session:', session.id);
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle other event types
    console.log('Received webhook event type:', event.type);
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing webhook:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
