import { ProfileDropdown } from "./ProfileDropdown";
import { useCompetition } from "@/hooks/useCompetition";
import { PredictionForm } from "./questions/PredictionForm";
import { LoadingState } from "./ui/LoadingState";
import { Logo } from "./navigation/Logo";
import { useNavigate, useParams } from "react-router-dom";
import { CompetitionButtons } from "./questions/CompetitionButtons";
import { CompetitionHeader } from "./questions/CompetitionHeader";
import { useCompetitionData } from "./questions/hooks/useCompetitionData";
import { supabase } from "@/integrations/supabase/client";

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

  const handleLogoClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  if (competitionLoading || questionsLoading || entryLoading) {
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
      
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <CompetitionHeader label={competition?.label || ''} />

        {!hasEntered && (
          <>
            <CompetitionButtons
              hasEntered={hasEntered}
              onEnterCompetition={() => setHasEntered(true)}
            />
            {questions && (
              <>
                <h2 className="text-2xl font-bold text-secondary mb-8 text-center mt-8">
                  Preview Questions
                </h2>
                <PredictionForm 
                  questions={questions}
                  answeredQuestions={0}
                  readOnly={true}
                />
              </>
            )}
          </>
        )}

        {hasEntered && questions && (
          <>
            <h2 className="text-2xl font-bold text-secondary mb-8 text-center">
              2025 AFL Time Capsule
            </h2>
            <PredictionForm 
              questions={questions} 
              answeredQuestions={entry?.predictions_count || 0}
              readOnly={false}
            />
          </>
        )}
      </div>
    </div>
  );
};