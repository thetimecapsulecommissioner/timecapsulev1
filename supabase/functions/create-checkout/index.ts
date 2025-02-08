
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Function invoked - starting execution');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting checkout process...');
    
    // Get user information from Authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted from header');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Supabase configuration missing');
    }

    console.log('Creating Supabase client...');
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Get user information
    console.log('Getting user information...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    if (!user) {
      console.error('No user found');
      throw new Error('User not found');
    }

    console.log('User found:', { id: user.id, email: user.email });

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
    let body;
    try {
      body = await req.json();
      console.log('Request body:', body);
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new Error('Invalid request body');
    }

    const { competitionId } = body;
    if (!competitionId) {
      throw new Error('No competition ID provided');
    }

    // Create Stripe checkout session
    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
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

    console.log('Checkout session created:', {
      id: session.id,
      url: session.url,
      status: session.status,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-checkout function:', {
      message: error.message,
      details: error.toString(),
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
