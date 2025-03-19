
import ProfileDropdown from "../ProfileDropdown";
import { useCompetition } from "@/hooks/useCompetition";
import { LoadingState } from "../ui/LoadingState";
import { Logo } from "../navigation/Logo";
import { useNavigate, useParams } from "react-router-dom";
import { CompetitionHeader } from "./CompetitionHeader";
import { useCompetitionData } from "./hooks/useCompetitionData";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { QuestionsContent } from "./QuestionsContent";

export const Questions = () => {
  const navigate = useNavigate();
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

  const [selectedPhase, setSelectedPhase] = useState<'pre-season' | 'mid-season' | null>(null);
  const { isAuthChecking } = useAuthCheck();
  const { isVerifyingPayment } = usePaymentVerification(competitionId, setHasEntered);

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (selectedPhase === 'pre-season') {
      toast.info("Scroll down to see the questions!");
    }
  }, [selectedPhase]);

  if (isAuthChecking || isVerifyingPayment || competitionLoading || questionsLoading || entryLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="fixed top-4 left-4 z-50">
        <Logo onClick={handleLogoClick} />
      </div>
      <div className="fixed top-4 right-4 z-50">
        <ProfileDropdown />
      </div>
      
      <div className="max-w-4xl mx-auto pt-28 px-4 sm:pt-20">
        <CompetitionHeader 
          label={competition?.label || ''} 
          hasEntered={hasEntered}
        />

        <QuestionsContent
          hasEntered={hasEntered}
          selectedPhase={selectedPhase}
          questions={questions}
          entry={entry}
          onPhaseSelect={setSelectedPhase}
          onEnterCompetition={() => setHasEntered(true)}
        />
      </div>
    </div>
  );
};
