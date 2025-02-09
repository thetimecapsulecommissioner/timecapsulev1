
import { ProfileDropdown } from "../ProfileDropdown";
import { Logo } from "../navigation/Logo";
import { CompetitionHeader } from "./CompetitionHeader";
import { PreEntryState } from "./pre-entry/PreEntryState";
import { PostEntryState } from "./post-entry/PostEntryState";
import { KeyTile } from "./KeyTile";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface QuestionsContainerProps {
  competition: any;
  questions: any[];
  entry: any;
  hasEntered: boolean;
  setHasEntered: (value: boolean) => void;
}

export const QuestionsContainer = ({
  competition,
  questions,
  entry,
  hasEntered,
  setHasEntered
}: QuestionsContainerProps) => {
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState<'pre-season' | 'mid-season' | null>(null);

  useEffect(() => {
    if (selectedPhase === 'pre-season') {
      toast.info("Scroll down to see the questions!");
    }
  }, [selectedPhase]);

  const handleLogoClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

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
            <div>
              {selectedPhase === 'pre-season' && (
                <KeyTile className="mt-4 mb-8" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
