
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting checkout process...');
    
    // Get user information
    const authHeader = req.headers.get('Authorization')!;
    console.log('Auth header present:', !!authHeader);
    
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    console.log('User found:', !!user);
    const email = user?.email;

    if (!email) {
      console.error('No email found for user');
      throw new Error('No email found');
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('Stripe key not found');
      throw new Error('Stripe configuration error');
    }

    console.log('Initializing Stripe...');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    // Get competition ID from request body
    const { competitionId } = await req.json();
    console.log('Competition ID:', competitionId);

    if (!competitionId) {
      throw new Error('No competition ID provided');
    }

    // Create the checkout session
    console.log('Creating payment session...');
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: 'price_1QmqnPDI8y21uYLJ8z036zLA',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/questions/${competitionId}`,
      cancel_url: `${req.headers.get('origin')}/questions/${competitionId}`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      submit_type: 'pay',
      payment_method_types: ['card'],
      currency: 'aud',
    });

    console.log('Payment session created:', session.id);
    console.log('Checkout URL:', session.url);

    if (!session.url) {
      throw new Error('No checkout URL generated');
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-checkout function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        stack: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
