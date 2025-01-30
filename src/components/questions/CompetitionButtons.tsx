import { useState, useEffect } from "react";
import { TermsDialog } from "./TermsDialog";
import { AcceptTermsDialog } from "./AcceptTermsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCountdown } from "@/hooks/useCountdown";
import { CountdownButton } from "./competition-buttons/CountdownButton";
import { EntryButtons } from "./competition-buttons/EntryButtons";

interface CompetitionButtonsProps {
  hasEntered: boolean;
  onEnterCompetition: () => void;
}

export const CompetitionButtons = ({
  hasEntered,
  onEnterCompetition,
}: CompetitionButtonsProps) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showAcceptTerms, setShowAcceptTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { id: competitionId } = useParams();

  // Define deadlines
  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const midSeasonDeadline = new Date('2025-06-14T18:00:00+10:00');
  
  const { formattedTimeLeft: preSeasonTimeLeft, timeLeft: preSeasonTime } = useCountdown(preSeasonDeadline);
  const { formattedTimeLeft: midSeasonTimeLeft, timeLeft: midSeasonTime } = useCountdown(midSeasonDeadline);

  useEffect(() => {
    const checkTermsAcceptance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !competitionId) return;

        const { data: entries, error: fetchError } = await supabase
          .from('competition_entries')
          .select('terms_accepted')
          .eq('user_id', user.id)
          .eq('competition_id', competitionId);

        if (fetchError) throw fetchError;

        if (entries && entries.length > 0) {
          if (entries[0].terms_accepted) {
            setTermsAccepted(true);
            onEnterCompetition();
          }
        } else {
          const { error: insertError } = await supabase
            .from('competition_entries')
            .insert({
              competition_id: competitionId,
              user_id: user.id,
              terms_accepted: false,
              responses_saved: 0
            });

          if (insertError) {
            console.error('Error creating competition entry:', insertError);
            toast.error("Failed to initialize competition entry");
          }
        }
      } catch (error) {
        console.error('Error checking terms acceptance:', error);
        toast.error("Failed to check terms acceptance status");
      }
    };
    
    checkTermsAcceptance();
  }, [competitionId, onEnterCompetition]);

  const handleAcceptTerms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      const { error } = await supabase
        .from('competition_entries')
        .update({ terms_accepted: true })
        .eq('user_id', user.id)
        .eq('competition_id', competitionId);

      if (error) throw error;

      setTermsAccepted(true);
      setShowAcceptTerms(false);
      onEnterCompetition();
      
      // Redirect to Stripe checkout
      const { data, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: { competitionId },
      });

      if (checkoutError) {
        console.error('Error creating checkout session:', checkoutError);
        toast.error("Failed to create checkout session");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }

      toast.success("Terms and conditions accepted successfully!");
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast.error("Failed to accept terms and conditions");
    }
  };

  if (termsAccepted) {
    return (
      <div className="space-y-4 mt-12">
        <CountdownButton
          label="Pre-Season Predictions"
          isOpen={!preSeasonTime.expired}
          timeLeft={preSeasonTimeLeft}
        />
        <CountdownButton
          label="Mid-Season Predictions"
          isOpen={!midSeasonTime.expired}
          timeLeft={midSeasonTimeLeft}
          disabled={!midSeasonTime.expired}
        />
      </div>
    );
  }

  return (
    <>
      <EntryButtons
        onEnterClick={() => setShowAcceptTerms(true)}
        onTermsClick={() => setShowTerms(true)}
      />

      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      <AcceptTermsDialog 
        open={showAcceptTerms} 
        onOpenChange={setShowAcceptTerms}
        onAcceptTerms={handleAcceptTerms}
      />
    </>
  );
};