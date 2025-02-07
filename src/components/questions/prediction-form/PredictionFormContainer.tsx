
import { useState } from "react";
import { PredictionFormHeader } from "./PredictionFormHeader";
import { PredictionList } from "./PredictionList";
import { PredictionFormFooter } from "./PredictionFormFooter";
import { SealPredictionDialog } from "./SealPredictionDialog";
import { TermsDialog } from "../TermsDialog";
import { GroupedPredictions, PredictionComments } from "@/types/predictions";

export interface PredictionFormContainerProps {
  questions: any[];
  predictions: GroupedPredictions;
  comments: PredictionComments;
  answeredQuestions: number;
  isSaving: boolean;
  isSealing: boolean;
  showSealDialog: boolean;
  setShowSealDialog: (show: boolean) => void;
  onSave: () => void;
  onSeal: () => void;
  onAnswerChange: (questionId: number, answers: string[], responseOrder?: number) => void;
  onCommentChange: (questionId: number, comment: string) => void;
  readOnly?: boolean;
}

export const PredictionFormContainer = ({ 
  questions,
  predictions,
  comments,
  answeredQuestions,
  isSaving,
  isSealing,
  showSealDialog,
  setShowSealDialog,
  onSave,
  onSeal,
  onAnswerChange,
  onCommentChange,
  readOnly = false
}: PredictionFormContainerProps) => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="space-y-8">
      {!readOnly && (
        <PredictionFormHeader
          onSave={onSave}
          onShowTerms={() => setShowTerms(true)}
          isSaving={isSaving}
          isSubmitted={false}
        />
      )}

      <PredictionList
        questions={questions}
        predictions={predictions}
        comments={comments}
        onAnswerChange={onAnswerChange}
        onCommentChange={onCommentChange}
        isSubmitted={readOnly}
        readOnly={readOnly}
      />

      {!readOnly && (
        <>
          <PredictionFormFooter
            onSave={onSave}
            onSeal={() => setShowSealDialog(true)}
            isSaving={isSaving}
            isSubmitted={false}
          />

          <SealPredictionDialog
            open={showSealDialog}
            onOpenChange={setShowSealDialog}
            onConfirm={onSeal}
            isSealing={isSealing}
          />

          <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
        </>
      )}
    </div>
  );
};
