import { ProfileDropdown } from "./ProfileDropdown";
import { useCompetition } from "@/hooks/useCompetition";
import { LoadingState } from "./ui/LoadingState";
import { Logo } from "./navigation/Logo";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CompetitionHeader } from "./questions/CompetitionHeader";
import { useCompetitionData } from "./questions/hooks/useCompetitionData";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
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
  const predictionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPhase === 'pre-season' && predictionsRef.current) {
      const currentScrollPosition = window.pageYOffset;
      window.scrollTo({ top: currentScrollPosition });
    }
  }, [selectedPhase]);

  useEffect(() => {
    const checkAndRestoreSession = async () => {
      try {
        console.log('Checking auth session state...', {
          hasSessionId: !!sessionId,
          competitionId
        });

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          throw error;
        }
        
        // If we have a session_id from Stripe but no auth session,
        // preserve the return URL and redirect to login
        if (!session && sessionId) {
          console.log('No auth session found with Stripe session_id, redirecting to login');
          const currentPath = `/competition/${competitionId}?session_id=${sessionId}`;
          const encodedRedirectUrl = encodeURIComponent(currentPath);
          navigate(`/login?redirectUrl=${encodedRedirectUrl}`);
          return;
        }
        
        // If no session and no session_id, redirect to regular login
        if (!session) {
          console.log('No auth session or Stripe session_id, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Auth session found:', {
          userId: session.user?.id,
          email: session.user?.email,
          hasSessionId: !!sessionId,
          competitionId
        });
        
        setIsAuthChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error("Authentication error. Please try logging in again.");
        navigate('/login');
      }
    };

    checkAndRestoreSession();
  }, [navigate, sessionId, competitionId]);

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
            <div ref={predictionsRef}>
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
