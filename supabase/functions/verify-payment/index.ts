
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { sessionId, competitionId, userId } = await req.json();
    console.log('Starting payment verification for:', { sessionId, competitionId, userId });

    if (!sessionId || !competitionId || !userId) {
      throw new Error('Missing required parameters');
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe configuration missing');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    // Get session from Stripe
    console.log('Retrieving Stripe session:', sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Retrieved Stripe session:', {
      id: session.id,
      status: session.payment_status,
      metadata: session.metadata
    });

    // Verify the session is paid and matches our records
    const isValidPayment = 
      session.payment_status === 'paid' && 
      session.metadata?.competition_id === competitionId &&
      session.metadata?.user_id === userId;

    console.log('Payment validation result:', {
      isValid: isValidPayment,
      paymentStatus: session.payment_status,
      metadataMatch: {
        competition: session.metadata?.competition_id === competitionId,
        user: session.metadata?.user_id === userId
      }
    });

    if (isValidPayment) {
      // Initialize Supabase admin client
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase configuration missing');
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Check if entry exists
      console.log('Checking for existing competition entry...');
      const { data: existingEntry, error: checkError } = await supabaseAdmin
        .from('competition_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('competition_id', competitionId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing entry:', checkError);
        throw checkError;
      }

      if (existingEntry) {
        console.log('Updating existing competition entry...');
        const { error: updateError } = await supabaseAdmin
          .from('competition_entries')
          .update({ 
            payment_completed: true,
            terms_accepted: true,
            status: 'In Progress',
            payment_session_id: sessionId
          })
          .eq('user_id', userId)
          .eq('competition_id', competitionId);

        if (updateError) {
          console.error('Error updating entry:', updateError);
          throw updateError;
        }
      } else {
        console.log('Creating new competition entry...');
        const { error: createError } = await supabaseAdmin
          .from('competition_entries')
          .insert({
            user_id: userId,
            competition_id: competitionId,
            payment_completed: true,
            terms_accepted: true,
            status: 'In Progress',
            payment_session_id: sessionId
          });

        if (createError) {
          console.error('Error creating entry:', createError);
          throw createError;
        }
      }

      console.log('Successfully processed payment and updated competition entry');
    }

    return new Response(
      JSON.stringify({ 
        paymentCompleted: isValidPayment,
        status: session.payment_status
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in verify-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
