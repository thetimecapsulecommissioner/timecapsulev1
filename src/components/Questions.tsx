
import { useCompetition } from "@/hooks/useCompetition";
import { LoadingState } from "./ui/LoadingState";
import { useParams } from "react-router-dom";
import { useCompetitionData } from "./questions/hooks/useCompetitionData";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { QuestionsContainer } from "./questions/QuestionsContainer";

export const Questions = () => {
  const { id: competitionId } = useParams();
  const { data: competition, isLoading: competitionLoading } = useCompetition(competitionId);
  const { 
    questions,
    questionsLoading,
    entry,
    entryLoading,
    hasEntered,
    setHasEntered
  } = useCompetitionData();

  const { isAuthChecking } = useAuthCheck();
  const { isVerifyingPayment } = usePaymentVerification(competitionId, setHasEntered);

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
