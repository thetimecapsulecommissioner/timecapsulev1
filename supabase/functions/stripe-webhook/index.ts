
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Stripe webhook function invoked');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('Missing Stripe secret key');
      throw new Error('Configuration error');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No Stripe signature found in request');
      throw new Error('No signature provided');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('Missing Stripe webhook secret');
      throw new Error('Configuration error');
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Webhook event constructed:', event.type);
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing successful checkout session:', session.id);

      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase configuration');
        throw new Error('Configuration error');
      }

      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.7.1');
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const { data, error } = await supabaseAdmin.rpc(
        'handle_stripe_payment_success',
        { payment_session_id: session.id }
      );

      if (error) {
        console.error('Error updating competition entry:', error);
        throw error;
      }

      console.log('Successfully processed payment for session:', session.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
