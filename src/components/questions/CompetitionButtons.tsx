
import { useState } from "react";
import { TermsDialog } from "./TermsDialog";
import { AcceptTermsDialog } from "./AcceptTermsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { useCountdown } from "@/hooks/useCountdown";
import { EntryButtons } from "./competition-buttons/EntryButtons";
import { toast } from "sonner";

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
  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const midSeasonDeadline = new Date('2025-06-14T18:00:00+10:00');
  
  const { formattedTimeLeft: preSeasonTimeLeft, timeLeft: preSeasonTime } = useCountdown(preSeasonDeadline);
  const { formattedTimeLeft: midSeasonTimeLeft, timeLeft: midSeasonTime } = useCountdown(midSeasonDeadline);

  const handleAcceptTerms = async () => {
    try {
      console.log('Handling terms acceptance in CompetitionButtons');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        toast.error('Authentication error. Please try logging in again.');
        return;
      }

      if (!user || !competitionId) {
        console.error('Missing required data:', { user: !!user, competitionId });
        toast.error('Required information missing. Please try again.');
        return;
      }

      // Check if payment is completed
      const { data: entry, error: entryError } = await supabase
        .from('competition_entries')
        .select('payment_completed')
        .eq('user_id', user.id)
        .eq('competition_id', competitionId)
        .maybeSingle();

      if (entryError) {
        console.error('Error checking entry status:', entryError);
        toast.error('Failed to verify entry status');
        return;
      }

      console.log('Entry status checked:', { entry, paymentCompleted: entry?.payment_completed });

      if (entry?.payment_completed) {
        console.log('Payment already completed, proceeding with competition entry');
        setShowAcceptTerms(false);
        onEnterCompetition();
      }
    } catch (error) {
      console.error('Error in handleAcceptTerms:', error);
      toast.error('Failed to process terms acceptance');
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
