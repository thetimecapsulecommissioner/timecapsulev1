
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePaymentVerification = (
  competitionId: string | undefined,
  setHasEntered: (value: boolean) => void
) => {
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!competitionId) return;

      try {
        console.log('Starting payment verification...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No user found when verifying payment');
          return;
        }

        // Get the latest entry
        const { data: entry, error: entryError } = await supabase
          .from('competition_entries')
          .select('*')
          .eq('user_id', user.id)
          .eq('competition_id', competitionId)
          .maybeSingle();

        if (entryError) {
          console.error('Error fetching entry:', entryError);
          toast.error('Failed to verify payment status');
          setIsVerifyingPayment(false);
          return;
        }

        console.log('Found competition entry:', entry);

        if (!entry) {
          setIsVerifyingPayment(false);
          return;
        }

        // If payment is already completed, no need to verify
        if (entry.payment_completed) {
          console.log('Payment already completed');
          setHasEntered(true);
          setIsVerifyingPayment(false);
          return;
        }

        // If we have a payment session ID, verify with Stripe
        if (entry.payment_session_id) {
          console.log('Verifying payment session:', entry.payment_session_id);
          
          // Poll payment status a few times
          let attempts = 0;
          const maxAttempts = 5;
          const pollInterval = 2000; // 2 seconds

          const pollPaymentStatus = async () => {
            if (attempts >= maxAttempts) {
              console.log('Max verification attempts reached');
              setIsVerifyingPayment(false);
              return;
            }

            console.log(`Payment verification attempt ${attempts + 1} of ${maxAttempts}`);

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
              setIsVerifyingPayment(false);
              return;
            }

            console.log('Payment verification response:', sessionData);

            if (sessionData?.paymentCompleted) {
              console.log('Payment verified successfully');
              setHasEntered(true);
              toast.success('Payment verified successfully!');
              setIsVerifyingPayment(false);
              return;
            }

            // If payment not completed yet, try again after delay
            attempts++;
            setTimeout(pollPaymentStatus, pollInterval);
          };

          // Start polling
          pollPaymentStatus();
        } else {
          setIsVerifyingPayment(false);
        }
      } catch (error) {
        console.error('Error in payment verification:', error);
        toast.error('Failed to verify payment status');
        setIsVerifyingPayment(false);
      }
    };

    verifyPayment();
  }, [competitionId, setHasEntered]);

  return { isVerifyingPayment };
};
