
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
      console.log('Starting accept terms process...', { competitionId });

      // Check session
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session check failed:', sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }

      if (!session?.session) {
        console.error('No active session found');
        throw new Error("No active session. Please log in again.");
      }

      console.log('Session validated:', {
        userId: session.session.user.id,
        accessToken: !!session.session.access_token
      });

      // Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }

      if (!user) {
        console.error('No user found after getUser call');
        throw new Error("User not found");
      }

      if (!competitionId) {
        console.error('No competition ID available');
        throw new Error("Competition ID not found");
      }

      console.log('Creating/updating competition entry for:', {
        userId: user.id,
        competitionId
      });

      // Create/update entry
      const { error: entryError } = await supabase
        .from('competition_entries')
        .upsert({
          user_id: user.id,
          competition_id: competitionId,
          terms_accepted: false,
          testing_mode: false,
          status: 'Not Started',
          payment_completed: false
        }, {
          onConflict: 'user_id,competition_id'
        });

      if (entryError) {
        console.error('Error creating/updating entry:', entryError);
        throw new Error(`Failed to create entry: ${entryError.message}`);
      }

      console.log('Competition entry created/updated, creating checkout session...');

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
        console.error('Checkout session creation failed:', checkoutError);
        throw new Error(`Checkout error: ${checkoutError.message}`);
      }

      if (!sessionData?.url) {
        console.error('No checkout URL received:', sessionData);
        throw new Error('Invalid checkout response');
      }

      console.log('Successfully created checkout session, redirecting to:', {
        url: sessionData.url.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      });

      // Call onAcceptTerms before redirecting
      onAcceptTerms();
      
      // Redirect to Stripe checkout
      window.location.href = sessionData.url;
    } catch (error) {
      console.error('Terms acceptance process failed:', {
        message: error instanceof Error ? error.message : String(error),
        details: error instanceof Error ? error.stack : error
      });
      
      toast.error(error instanceof Error ? error.message : 'Failed to process terms and payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleAcceptTerms
  };
};
