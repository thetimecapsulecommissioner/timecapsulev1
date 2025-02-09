
import { useParams } from "react-router-dom";
import { useCountdown } from "@/hooks/useCountdown";
import { TermsDialog } from "./TermsDialog";
import { AcceptTermsDialog } from "./AcceptTermsDialog";
import { EntryButtons } from "./competition-buttons/EntryButtons";
import { useTerms } from "./hooks/useTerms";

interface CompetitionButtonsProps {
  hasEntered: boolean;
  onEnterCompetition: () => void;
}

export const CompetitionButtons = ({
  hasEntered,
  onEnterCompetition,
}: CompetitionButtonsProps) => {
  const { id: competitionId } = useParams();
  const {
    showTerms,
    setShowTerms,
    showAcceptTerms,
    setShowAcceptTerms,
    isProcessing,
    handleAcceptTerms
  } = useTerms(onEnterCompetition);

  // Define deadlines
  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const midSeasonDeadline = new Date('2025-06-14T18:00:00+10:00');
  
  const { formattedTimeLeft: preSeasonTimeLeft, timeLeft: preSeasonTime } = useCountdown(preSeasonDeadline);
  const { formattedTimeLeft: midSeasonTimeLeft, timeLeft: midSeasonTime } = useCountdown(midSeasonDeadline);

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
