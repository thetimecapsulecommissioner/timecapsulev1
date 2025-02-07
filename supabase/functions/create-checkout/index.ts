
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
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Get user information
    const authHeader = req.headers.get('Authorization');
    console.log('Raw auth header:', authHeader);
    
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted, creating Supabase client...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    console.log('Supabase configuration:', {
      urlPresent: !!supabaseUrl,
      anonKeyPresent: !!supabaseAnonKey
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Supabase configuration missing');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created, getting user...');

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      console.error('Error getting user:', {
        error: userError,
        message: userError.message,
        details: userError.toString()
      });
      throw userError;
    }

    console.log('User found:', {
      id: user?.id,
      emailPresent: !!user?.email
    });
    
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

    // Get competition ID and validate request body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', body);
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new Error('Invalid request body');
    }

    const { competitionId } = body;
    console.log('Competition ID:', competitionId);

    if (!competitionId) {
      throw new Error('No competition ID provided');
    }

    // Create the checkout session
    console.log('Creating payment session with params:', {
      customer_email: email,
      success_url: `${req.headers.get('origin')}/questions/${competitionId}`,
      cancel_url: `${req.headers.get('origin')}/questions/${competitionId}`,
      mode: 'payment',
      allow_promotion_codes: true,
    });

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

    console.log('Payment session created:', {
      sessionId: session.id,
      url: session.url,
      status: session.status,
      paymentStatus: session.payment_status,
    });

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
    console.error('Error in create-checkout function:', {
      message: error.message,
      details: error.toString(),
      stack: error.stack,
      raw: error
    });
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
