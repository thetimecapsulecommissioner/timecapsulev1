import { PredictionFormContainer } from "./prediction-form/PredictionFormContainer";

interface PredictionFormProps {
  questions: any[];
  answeredQuestions: number;
}

export const PredictionForm = ({ 
  questions,
  answeredQuestions 
}: PredictionFormProps) => {
  return (
    <PredictionFormContainer
      questions={questions}
      answeredQuestions={answeredQuestions}
    />
  );
};