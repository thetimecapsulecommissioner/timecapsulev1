
import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTermsAcceptance = (onAcceptTerms: () => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { id: competitionId } = useParams();

  const handleAcceptTerms = async () => {
    try {
      setIsProcessing(true);
      console.log('Starting accept terms process...');

      // Check session
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.session) {
        console.error('Session check failed:', {
          error: sessionError,
          sessionExists: !!session?.session
        });
        throw new Error("Authentication session not found. Please try logging in again.");
      }

      console.log('Session validated:', {
        sessionExists: !!session.session,
        userExists: !!session.session?.user,
        accessToken: !!session.session.access_token
      });

      // Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }

      if (!user || !competitionId) {
        console.error('Missing user or competition ID:', { user: !!user, competitionId });
        throw new Error("User or competition not found");
      }

      // Check existing payment
      const { data: existingEntry, error: entryCheckError } = await supabase
        .from('competition_entries')
        .select('payment_completed, payment_session_id')
        .eq('user_id', user.id)
        .eq('competition_id', competitionId)
        .maybeSingle();

      if (entryCheckError) {
        console.error('Error checking competition entry:', entryCheckError);
        throw entryCheckError;
      }

      if (existingEntry?.payment_completed) {
        console.log('User has already paid');
        onAcceptTerms();
        return;
      }

      // Create/update entry
      const { error: entryError } = await supabase
        .from('competition_entries')
        .upsert({
          user_id: user.id,
          competition_id: competitionId,
          terms_accepted: true,
          testing_mode: false,
          status: 'Not Started',
          payment_completed: false
        }, {
          onConflict: 'user_id,competition_id'
        });

      if (entryError) {
        console.error('Error creating/updating entry:', entryError);
        throw entryError;
      }

      // Create checkout session
      const { data: sessionData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: { competitionId },
          headers: {
            Authorization: `Bearer ${session.session.access_token}`
          }
        }
      );

      if (checkoutError) {
        console.error('Checkout error:', checkoutError);
        throw checkoutError;
      }

      if (!sessionData?.url) {
        console.error('No checkout URL received:', sessionData);
        throw new Error('No checkout URL received');
      }

      console.log('Redirecting to checkout:', sessionData.url);
      window.location.href = sessionData.url;
      onAcceptTerms();
    } catch (error) {
      console.error('Error processing terms and payment:', {
        message: error.message,
        details: error.toString(),
        stack: error.stack
      });
      let errorMessage = "Failed to process terms and payment. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleAcceptTerms
  };
};
