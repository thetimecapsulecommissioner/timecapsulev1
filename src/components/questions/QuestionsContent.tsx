
import { PreEntryState } from "./pre-entry/PreEntryState";
import { PostEntryState } from "./post-entry/PostEntryState";
import { KeyTile } from "./KeyTile";

interface QuestionsContentProps {
  hasEntered: boolean;
  selectedPhase: 'pre-season' | 'mid-season' | null;
  questions: any[];
  entry: any;
  onPhaseSelect: (phase: 'pre-season' | 'mid-season') => void;
  onEnterCompetition: () => void;
}

export const QuestionsContent = ({
  hasEntered,
  selectedPhase,
  questions,
  entry,
  onPhaseSelect,
  onEnterCompetition
}: QuestionsContentProps) => {
  if (!hasEntered) {
    return (
      <PreEntryState
        questions={questions}
        selectedPhase={selectedPhase}
        onPhaseSelect={onPhaseSelect}
        onEnterCompetition={onEnterCompetition}
      />
    );
  }

  return (
    <>
      <PostEntryState
        questions={questions}
        selectedPhase={selectedPhase}
        onPhaseSelect={onPhaseSelect}
        entry={entry}
      />
      <div>
        {selectedPhase === 'pre-season' && (
          <KeyTile className="mt-4 mb-8" />
        )}
      </div>
    </>
  );
};
