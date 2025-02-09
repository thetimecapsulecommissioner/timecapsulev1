
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
      if (sessionError || !session?.session) {
        console.error('Session check failed:', sessionError);
        throw new Error(sessionError ? sessionError.message : "No active session. Please log in again.");
      }

      console.log('Session validated:', {
        userId: session.session.user.id,
        accessToken: !!session.session.access_token
      });

      // Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Error getting user:', userError);
        throw new Error("Failed to get user information");
      }

      if (!competitionId) {
        console.error('No competition ID available');
        throw new Error("Competition ID not found");
      }

      // First, check if entry already exists and is paid
      const { data: existingEntry, error: checkError } = await supabase
        .from('competition_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('competition_id', competitionId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing entry:', checkError);
        throw new Error("Failed to check entry status");
      }

      console.log('Existing entry check:', existingEntry);

      // If entry exists and payment is completed, just proceed
      if (existingEntry?.payment_completed) {
        console.log('Entry already exists and is paid, proceeding...');
        onAcceptTerms();
        return;
      }

      // Make sure entry exists before creating checkout session
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
        throw new Error(`Failed to create entry: ${entryError.message}`);
      }

      console.log('Competition entry created/updated successfully, proceeding to checkout...');

      // Create checkout session with proper authorization
      const { data: sessionData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: { competitionId },
          headers: {
            Authorization: `Bearer ${session.session.access_token}`
          }
        }
      );

      if (checkoutError || !sessionData?.url) {
        console.error('Checkout session creation failed:', checkoutError || 'No URL received');
        throw new Error(checkoutError?.message || 'Failed to create checkout session');
      }

      console.log('Successfully created checkout session:', {
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
