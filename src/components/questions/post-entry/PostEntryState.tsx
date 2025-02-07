
import { PredictionPhaseButtons } from "../prediction-phase/PredictionPhaseButtons";
import { PredictionForm } from "../PredictionForm";
import { KeyTile } from "../KeyTile";

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
  return (
    <>
      <PredictionPhaseButtons
        onPhaseSelect={onPhaseSelect}
        selectedPhase={selectedPhase}
      />
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
    </>
  );
};
