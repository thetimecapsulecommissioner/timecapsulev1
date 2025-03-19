
import { useState } from "react";
import { PredictionFormContainer } from "./prediction-form/PredictionFormContainer";
import { LoadingState } from "../ui/LoadingState";
import { usePredictionForm } from "./prediction-form/usePredictionForm";

interface PredictionFormProps {
  questions: any[];
  answeredQuestions: number;
  readOnly?: boolean;
  isTimeExpired?: boolean;
}

export const PredictionForm = ({ 
  questions,
  answeredQuestions,
  readOnly = false,
  isTimeExpired = false
}: PredictionFormProps) => {
  const {
    predictions,
    predictionsLoading,
    comments,
    isSaving,
    handleSaveResponses,
    handleAnswerChange,
    handleCommentChange,
    isSubmitted,
  } = usePredictionForm(questions);

  if (predictionsLoading) {
    return <LoadingState />;
  }

  return (
    <PredictionFormContainer
      questions={questions}
      predictions={predictions || {}}
      comments={comments}
      answeredQuestions={answeredQuestions}
      isSaving={isSaving}
      onSave={handleSaveResponses}
      onAnswerChange={handleAnswerChange}
      onCommentChange={handleCommentChange}
      readOnly={readOnly || isSubmitted}
      isSubmitted={isSubmitted}
      isTimeExpired={isTimeExpired}
    />
  );
};
