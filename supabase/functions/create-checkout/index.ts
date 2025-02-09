
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Function invoked - starting execution');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting checkout process...');
    
    // Validate authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Supabase configuration missing');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Verify user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      throw userError || new Error('User not found');
    }

    console.log('User found:', { id: user.id, email: user.email });

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('Stripe key not found');
      throw new Error('Stripe configuration error');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    // Parse request body
    const { competitionId } = await req.json();
    if (!competitionId) {
      throw new Error('No competition ID provided');
    }

    // Create unique reference ID
    const clientReferenceId = `${user.id}_${competitionId}`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: clientReferenceId,
      line_items: [
        {
          price: 'price_1QkbfoDI8y21uYLJ3bcWNfWg',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://thetimecapsule1.netlify.app/competition/${competitionId}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `https://thetimecapsule1.netlify.app/competition/${competitionId}?session_id={CHECKOUT_SESSION_ID}&canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      submit_type: 'pay',
      payment_method_types: ['card'],
      currency: 'aud',
      metadata: {
        user_id: user.id,
        competition_id: competitionId
      }
    });

    // Update entry with session ID
    const { error: updateError } = await supabaseClient
      .from('competition_entries')
      .update({ 
        payment_session_id: session.id,
        status: 'Pending Payment'
      })
      .eq('user_id', user.id)
      .eq('competition_id', competitionId);

    if (updateError) {
      console.error('Error updating competition entry:', updateError);
      throw updateError;
    }

    console.log('Checkout session created successfully:', {
      id: session.id,
      url: session.url,
      status: session.status
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
        status: 400,
      }
    );
  }
});
