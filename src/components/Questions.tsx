
import { ProfileDropdown } from "./ProfileDropdown";
import { useCompetition } from "@/hooks/useCompetition";
import { LoadingState } from "./ui/LoadingState";
import { Logo } from "./navigation/Logo";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CompetitionHeader } from "./questions/CompetitionHeader";
import { useCompetitionData } from "./questions/hooks/useCompetitionData";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { PreEntryState } from "./questions/pre-entry/PreEntryState";
import { PostEntryState } from "./questions/post-entry/PostEntryState";
import { KeyTile } from "./questions/KeyTile";
import { toast } from "sonner";

export const Questions = () => {
  const navigate = useNavigate();
  const { id: competitionId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
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
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAndRestoreSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          // If there's no session but we have a session_id from Stripe,
          // let the user know they need to log in again
          if (sessionId) {
            toast.error("Your session has expired. Please log in again to access your competition.");
          }
          navigate('/login');
          return;
        }
        
        setIsAuthChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error("Authentication error. Please try logging in again.");
        navigate('/login');
      }
    };

    checkAndRestoreSession();
  }, [navigate, sessionId]);

  const handleLogoClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  if (isAuthChecking || competitionLoading || questionsLoading || entryLoading) {
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
  );
};
