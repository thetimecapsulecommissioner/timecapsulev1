
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
              }
            }
          );

          if (sessionError) {
            console.error('Error verifying stripe session:', sessionError);
            toast.error('Failed to verify payment status');
          } else if (sessionData?.paymentCompleted) {
            console.log('Payment verified successfully');
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

          if (!entry) {
            setIsVerifyingPayment(false);
            return;
          }

          // If payment is already completed, no need to verify
          if (entry.payment_completed) {
            setHasEntered(true);
            setIsVerifyingPayment(false);
            return;
          }

          // If we have a payment session ID, verify with Stripe
          if (entry.payment_session_id) {
            const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
              'verify-payment',
              {
                body: { 
                  sessionId: entry.payment_session_id,
                  competitionId,
                  userId: user.id
                }
              }
            );

            if (sessionError) {
              console.error('Error verifying payment:', sessionError);
              toast.error('Failed to verify payment status');
            } else if (sessionData?.paymentCompleted) {
              setHasEntered(true);
              toast.success('Payment verified successfully!');
            }
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
