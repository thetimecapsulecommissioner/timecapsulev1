
import { useState } from "react";
import { PredictionFormHeader } from "./PredictionFormHeader";
import { PredictionList } from "./PredictionList";
import { PredictionFormFooter } from "./PredictionFormFooter";
import { TermsDialog } from "../TermsDialog";
import { GroupedPredictions, PredictionComments } from "@/types/predictions";

export interface PredictionFormContainerProps {
  questions: any[];
  predictions: GroupedPredictions;
  comments: PredictionComments;
  answeredQuestions: number;
  isSaving: boolean;
  onSave: () => void;
  onAnswerChange: (questionId: number, answers: string[], responseOrder?: number) => void;
  onCommentChange: (questionId: number, comment: string) => void;
  readOnly?: boolean;
  isSubmitted: boolean;
  isTimeExpired?: boolean;
}

export const PredictionFormContainer = ({ 
  questions,
  predictions,
  comments,
  answeredQuestions,
  isSaving,
  onSave,
  onAnswerChange,
  onCommentChange,
  readOnly = false,
  isSubmitted,
  isTimeExpired = false
}: PredictionFormContainerProps) => {
  const [showTerms, setShowTerms] = useState(false);
  
  // Determine if the form should be readonly based on submission status or time expiration
  const formIsReadOnly = readOnly || isSubmitted || isTimeExpired;

  return (
    <div className="space-y-8">
      {!readOnly && (
        <PredictionFormHeader
          onSave={onSave}
          onShowTerms={() => setShowTerms(true)}
          isSaving={isSaving}
          isSubmitted={isSubmitted}
          isTimeExpired={isTimeExpired}
        />
      )}

      <PredictionList
        questions={questions}
        predictions={predictions}
        comments={comments}
        onAnswerChange={onAnswerChange}
        onCommentChange={onCommentChange}
        isSubmitted={isSubmitted}
        readOnly={formIsReadOnly}
      />

      {!readOnly && (
        <>
          <PredictionFormFooter
            onSave={onSave}
            isSaving={isSaving}
            isSubmitted={isSubmitted}
            isTimeExpired={isTimeExpired}
          />

          <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
        </>
      )}
    </div>
  );
};
