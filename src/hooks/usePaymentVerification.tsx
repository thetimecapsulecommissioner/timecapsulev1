
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePaymentVerification = (
  competitionId: string | undefined,
  setHasEntered: (value: boolean) => void
) => {
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!competitionId) return;

      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error('No session found when verifying payment');
          return;
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No user found when verifying payment');
          return;
        }

        // Check for session_id in URL (from Stripe redirect)
        const sessionId = searchParams.get('session_id');
        console.log('Checking session ID from URL:', sessionId);

        if (sessionId) {
          console.log('Found session ID in URL, verifying payment...');
          const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
            'verify-payment',
            {
              body: { 
                sessionId,
                competitionId,
                userId: user.id
              },
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            }
          );

          if (sessionError) {
            console.error('Error verifying stripe session:', sessionError);
            toast.error('Failed to verify payment status');
          } else if (sessionData?.paymentCompleted) {
            console.log('Payment verified successfully');
            
            // Directly update the database entry immediately
            const { error: updateError } = await supabase
              .from('competition_entries')
              .update({
                payment_completed: true,
                terms_accepted: true,
                status: 'In Progress'
              })
              .eq('user_id', user.id)
              .eq('competition_id', competitionId);
              
            if (updateError) {
              console.error('Error updating entry after payment:', updateError);
            } else {
              console.log('Entry updated with payment_completed=true');
            }
            
            setHasEntered(true);
            toast.success('Payment verified successfully! You are now entered in the competition.');
            
            // Remove session_id from URL without page reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        } else {
          // Get the latest entry if no session_id in URL
          const { data: entry } = await supabase
            .from('competition_entries')
            .select('*')
            .eq('user_id', user.id)
            .eq('competition_id', competitionId)
            .maybeSingle();

          console.log('Checking existing entry payment status:', entry);

          if (entry?.payment_completed) {
            setHasEntered(true);
          }
        }

        setIsVerifyingPayment(false);
      } catch (error) {
        console.error('Error in payment verification:', error);
        toast.error('Failed to verify payment status');
        setIsVerifyingPayment(false);
      }
    };

    verifyPayment();
  }, [competitionId, setHasEntered, searchParams]);

  return { isVerifyingPayment };
};
