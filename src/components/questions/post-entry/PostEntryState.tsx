
import { PredictionPhaseButtons } from "../prediction-phase/PredictionPhaseButtons";
import { PredictionForm } from "../PredictionForm";
import { KeyTile } from "../KeyTile";
import { EntryButtons } from "../competition-buttons/EntryButtons";
import { useState } from "react";
import { TermsAndConditionsDialog } from "../TermsAndConditionsDialog";

interface PostEntryStateProps {
  questions: any[];
  selectedPhase: 'pre-season' | 'mid-season' | null;
  onPhaseSelect: (phase: 'pre-season' | 'mid-season') => void;
  entry: any;
}

export const PostEntryState = ({
  questions,
  selectedPhase,
  onPhaseSelect,
  entry
}: PostEntryStateProps) => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <PredictionPhaseButtons
        onPhaseSelect={onPhaseSelect}
        selectedPhase={selectedPhase}
      />

      <div className="mt-4">
        <EntryButtons
          onEnterClick={() => {}}  // No-op since already entered
          onTermsClick={() => setShowTerms(true)}
        />
      </div>

      {selectedPhase === 'pre-season' && questions && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-secondary mb-8 text-center">
            Pre-Season Predictions
          </h2>
          <KeyTile className="mb-8" />
          <PredictionForm 
            questions={questions} 
            answeredQuestions={entry?.predictions_count || 0}
            readOnly={false}
          />
        </div>
      )}

      <TermsAndConditionsDialog
        open={showTerms}
        onOpenChange={setShowTerms}
      />
    </>
  );
};
