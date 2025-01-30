import { PredictionFormContainer } from "./prediction-form/PredictionFormContainer";
import { LoadingState } from "../ui/LoadingState";
import { usePredictionForm } from "./prediction-form/usePredictionForm";

interface PredictionFormProps {
  questions: any[];
  answeredQuestions: number;
}

export const PredictionForm = ({ 
  questions,
  answeredQuestions 
}: PredictionFormProps) => {
  const {
    predictions,
    predictionsLoading,
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
      isSealing={isSealing}
      showSealDialog={showSealDialog}
      setShowSealDialog={setShowSealDialog}
      onSave={handleSaveResponses}
      onSeal={handleSealPredictions}
      onAnswerChange={handleAnswerChange}
      onCommentChange={handleCommentChange}
    />
  );
};