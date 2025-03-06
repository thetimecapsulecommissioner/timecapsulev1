
import { useState } from "react";
import { TermsDialog } from "./TermsDialog";
import { AcceptTermsDialog } from "./AcceptTermsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { useCountdown } from "@/hooks/useCountdown";
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
  const { id: competitionId } = useParams();

  // Define deadlines
  const preSeasonDeadline = new Date('2025-03-07T00:00:00+11:00');
  const midSeasonDeadline = new Date('2025-06-14T18:00:00+10:00');
  
  const { formattedTimeLeft: preSeasonTimeLeft, timeLeft: preSeasonTime } = useCountdown(preSeasonDeadline);
  const { formattedTimeLeft: midSeasonTimeLeft, timeLeft: midSeasonTime } = useCountdown(midSeasonDeadline);

  const handleAcceptTerms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      // Check if payment is completed before setting hasEntered
      const { data: entry, error: entryError } = await supabase
        .from('competition_entries')
        .select('payment_completed')
        .eq('user_id', user.id)
        .eq('competition_id', competitionId)
        .maybeSingle();

      if (entryError) {
        console.error('Error checking entry status:', entryError);
        return;
      }

      if (entry?.payment_completed) {
        setShowAcceptTerms(false);
        onEnterCompetition();
      }
    } catch (error) {
      console.error('Error accepting terms:', error);
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
