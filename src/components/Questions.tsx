
import { ProfileDropdown } from "./ProfileDropdown";
import { useCompetition } from "@/hooks/useCompetition";
import { LoadingState } from "./ui/LoadingState";
import { Logo } from "./navigation/Logo";
import { useNavigate, useParams } from "react-router-dom";
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
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(true);

  useEffect(() => {
    if (selectedPhase === 'pre-season') {
      toast.info("Scroll down to see the questions!");
    }
  }, [selectedPhase]);

  // Verify payment status on component mount
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
        const { data: entry } = await supabase
          .from('competition_entries')
          .select('*')
          .eq('user_id', user.id)
          .eq('competition_id', competitionId)
          .maybeSingle();

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

  useEffect(() => {
    const checkAndRestoreSession = async () => {
      try {
        console.log('Checking auth session state...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          throw error;
        }
        
        if (!session) {
          console.log('No auth session found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Auth session found:', {
          userId: session.user?.id,
          email: session.user?.email
        });
        
        setIsAuthChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error("Authentication error. Please try logging in again.");
        navigate('/login');
      }
    };

    checkAndRestoreSession();
  }, [navigate]);

  const handleLogoClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

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
