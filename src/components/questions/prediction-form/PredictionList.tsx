
import { QuestionCard } from "../QuestionCard";
import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";

interface PredictionListProps {
  questions: any[];
  predictions: Record<number, string[]>;
  comments: Record<number, string>;
  onAnswerChange: (questionId: number, answers: string[], responseOrder?: number) => void;
  onCommentChange: (questionId: number, comment: string) => void;
  isSubmitted: boolean;
  readOnly?: boolean;
}

export const PredictionList = ({
  questions,
  predictions,
  comments,
  onAnswerChange,
  onCommentChange,
  isSubmitted,
  readOnly = false
}: PredictionListProps) => {
  const handleCommentChange = useCallback((questionId: number, value: string) => {
    if (isSubmitted) return;
    onCommentChange(questionId, value);
  }, [onCommentChange, isSubmitted]);

  const finalReadOnly = readOnly || isSubmitted;

  return (
    <div className="space-y-8">
      {questions?.map((question) => (
        <div key={question.id} className="space-y-4">
          <QuestionCard
            id={question.id}
            question={question.question}
            options={question.options}
            selectedAnswer={predictions?.[question.id] || []}
            helpText={question.help_text}
            responseCategory={question.response_category}
            points={question.points}
            requiredAnswers={question.required_answers}
            onAnswerChange={onAnswerChange}
            disabled={finalReadOnly}
          />
          {!finalReadOnly && (
            <Textarea
              placeholder="Add a comment about your response (optional)"
              value={comments[question.id] || ''}
              onChange={(e) => handleCommentChange(question.id, e.target.value)}
              className="mt-2"
              disabled={isSubmitted}
            />
          )}
        </div>
      ))}
    </div>
  );
};
