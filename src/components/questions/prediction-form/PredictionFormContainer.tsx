
import { useState, useEffect } from "react";
import { PredictionFormHeader } from "./PredictionFormHeader";
import { PredictionList } from "./PredictionList";
import { PredictionFormFooter } from "./PredictionFormFooter";
import { TermsDialog } from "../TermsDialog";
import { GroupedPredictions, PredictionComments } from "@/types/predictions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";

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
  isSubmitted
}: PredictionFormContainerProps) => {
  const [showTerms, setShowTerms] = useState(false);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(true); // Set to true to lock predictions
  
  // Always mark deadline as passed to lock predictions
  useEffect(() => {
    setIsDeadlinePassed(true);
  }, []);

  // Set form as read-only if deadline passed, explicitly requested, or if submitted
  const formReadOnly = readOnly || isSubmitted || isDeadlinePassed;

  return (
    <div className="space-y-8">
      {isDeadlinePassed && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            The competition is now closed. Predictions are locked and cannot be modified.
          </AlertDescription>
        </Alert>
      )}
      
      {!formReadOnly && (
        <PredictionFormHeader
          onSave={onSave}
          onShowTerms={() => setShowTerms(true)}
          isSaving={isSaving}
          isSubmitted={isSubmitted}
        />
      )}

      <PredictionList
        questions={questions}
        predictions={predictions}
        comments={comments}
        onAnswerChange={onAnswerChange}
        onCommentChange={onCommentChange}
        isSubmitted={isSubmitted}
        readOnly={formReadOnly}
      />

      {!formReadOnly && (
        <>
          <PredictionFormFooter
            onSave={onSave}
            isSaving={isSaving}
            isSubmitted={isSubmitted}
          />

          <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
        </>
      )}
    </div>
  );
};
