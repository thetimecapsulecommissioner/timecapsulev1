
import { useCompetition } from "@/hooks/useCompetition";
import { LoadingState } from "./ui/LoadingState";
import { useParams, useSearchParams } from "react-router-dom";
import { useCompetitionData } from "./questions/hooks/useCompetitionData";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { QuestionsContainer } from "./questions/QuestionsContainer";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Questions = () => {
  const { id: competitionId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const { data: competition, isLoading: competitionLoading } = useCompetition(competitionId);
  const { 
    questions,
    questionsLoading,
    entry,
    entryLoading,
    hasEntered,
    setHasEntered,
    userData
  } = useCompetitionData();

  const { isAuthChecking } = useAuthCheck();
  const { isVerifyingPayment } = usePaymentVerification(competitionId, setHasEntered);

  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId && success === 'true' && competitionId && userData?.id) {
        try {
          const { data, error } = await supabase.functions.invoke(
            'verify-payment',
            {
              body: { 
                sessionId,
                competitionId,
                userId: userData.id
              }
            }
          );

          if (error) throw error;

          if (data?.paymentCompleted) {
            toast.success('Payment verified successfully!');
            setHasEntered(true);
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error('Failed to verify payment. Please contact support.');
        }
      } else if (canceled === 'true') {
        toast.error('Payment was canceled. Please try again.');
      }
    };

    verifyPayment();
  }, [sessionId, success, canceled, competitionId, userData?.id, setHasEntered]);

  if (isAuthChecking || isVerifyingPayment || competitionLoading || questionsLoading || entryLoading) {
    return <LoadingState />;
  }

  return (
    <QuestionsContainer
      competition={competition}
      questions={questions}
      entry={entry}
      hasEntered={hasEntered}
      setHasEntered={setHasEntered}
    />
  );
};
