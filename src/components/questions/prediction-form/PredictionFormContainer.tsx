import { useState } from "react";
import { usePredictionForm } from "./usePredictionForm";
import { PredictionFormHeader } from "./PredictionFormHeader";
import { PredictionList } from "./PredictionList";
import { PredictionFormFooter } from "./PredictionFormFooter";
import { SealPredictionDialog } from "./SealPredictionDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TermsDialog } from "../TermsDialog";

interface PredictionFormContainerProps {
  questions: any[];
  answeredQuestions: number;
}

export const PredictionFormContainer = ({ 
  questions,
  answeredQuestions 
}: PredictionFormContainerProps) => {
  const [showTerms, setShowTerms] = useState(false);
  const {
    predictions,
    comments,
    isSaving,
    isSealing,
    showSealDialog,
    setShowSealDialog,
    handleSaveResponses,
    handleSealPredictions,
    handleAnswerChange,
    handleCommentChange,
  } = usePredictionForm(questions);

  return (
    <div className="space-y-8">
      <PredictionFormHeader
        onSave={handleSaveResponses}
        onShowTerms={() => setShowTerms(true)}
        isSaving={isSaving}
        isSubmitted={false}
      />

      <PredictionList
        questions={questions}
        predictions={predictions || {}}
        comments={comments}
        onAnswerChange={handleAnswerChange}
        onCommentChange={handleCommentChange}
        isSubmitted={false}
      />

      <PredictionFormFooter
        onSave={handleSaveResponses}
        onSeal={() => setShowSealDialog(true)}
        isSaving={isSaving}
        isSubmitted={false}
      />

      <SealPredictionDialog
        open={showSealDialog}
        onOpenChange={setShowSealDialog}
        onConfirm={handleSealPredictions}
        isSealing={isSealing}
      />

      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
    </div>
  );
};