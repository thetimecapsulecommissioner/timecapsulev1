
import { ProfileDropdown } from "./ProfileDropdown";
import { useCompetition } from "@/hooks/useCompetition";
import { LoadingState } from "./ui/LoadingState";
import { Logo } from "./navigation/Logo";
import { useNavigate, useParams } from "react-router-dom";
import { CompetitionHeader } from "./questions/CompetitionHeader";
import { useCompetitionData } from "./questions/hooks/useCompetitionData";
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { PreEntryState } from "./questions/pre-entry/PreEntryState";
import { PostEntryState } from "./questions/post-entry/PostEntryState";
import { KeyTile } from "./questions/KeyTile";

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
    <TooltipProvider>
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

          {!hasEntered ? (
            <PreEntryState
              questions={questions}
              selectedPhase={selectedPhase}
              onPhaseSelect={setSelectedPhase}
              onEnterCompetition={() => setHasEntered(true)}
            />
          ) : (
            <>
              <PostEntryState
                questions={questions}
                selectedPhase={selectedPhase}
                onPhaseSelect={setSelectedPhase}
                entry={entry}
              />
              {selectedPhase === 'pre-season' && (
                <KeyTile className="mt-4 mb-8" />
              )}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
