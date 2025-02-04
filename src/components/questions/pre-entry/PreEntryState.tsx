import { CompetitionButtons } from "../CompetitionButtons";
import { PredictionPhaseButtons } from "../prediction-phase/PredictionPhaseButtons";
import { PredictionForm } from "../PredictionForm";

interface PreEntryStateProps {
  questions: any[];
  selectedPhase: 'pre-season' | 'mid-season' | null;
  onPhaseSelect: (phase: 'pre-season' | 'mid-season') => void;
  onEnterCompetition: () => void;
}

export const PreEntryState = ({
  questions,
  selectedPhase,
  onPhaseSelect,
  onEnterCompetition
}: PreEntryStateProps) => {
  return (
    <>
      <CompetitionButtons
        hasEntered={false}
        onEnterCompetition={onEnterCompetition}
      />
      <PredictionPhaseButtons
        onPhaseSelect={onPhaseSelect}
        selectedPhase={selectedPhase}
      />
      {selectedPhase === 'pre-season' && questions && (
        <>
          <h2 className="text-2xl font-bold text-secondary mb-8 text-center mt-8">
            Preview Questions
          </h2>
          <PredictionForm 
            questions={questions}
            answeredQuestions={0}
            readOnly={true}
          />
        </>
      )}
    </>
  );
};