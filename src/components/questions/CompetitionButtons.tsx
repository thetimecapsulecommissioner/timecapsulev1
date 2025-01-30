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
    const resetTermsAndPayment = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !competitionId) return;

        // Reset terms_accepted to false for testing
        const { error: updateError } = await supabase
          .from('competition_entries')
          .update({ terms_accepted: false })
          .eq('user_id', user.id)
          .eq('competition_id', competitionId);

        if (updateError) throw updateError;

      } catch (error) {
        console.error('Error resetting terms:', error);
        toast.error("Failed to reset terms acceptance status");
      }
    };
    
    resetTermsAndPayment();
  }, [competitionId]);

  const handleAcceptTerms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      setTermsAccepted(true);
      setShowAcceptTerms(false);
      onEnterCompetition();
      
      // Initiate payment process
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
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast.error("Failed to accept terms and conditions");
    }
  };

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