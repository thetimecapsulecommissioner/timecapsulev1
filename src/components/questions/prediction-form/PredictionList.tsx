
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
    onCommentChange(questionId, value);
  }, [onCommentChange]);

  return (
    <div className="space-y-8">
      {questions?.map((question) => {
        // Special handling for Question 3
        let enhancedQuestion = {...question};
        if (question.id === 3) {
          // Check if "nil" is in the options
          const hasNil = question.options.some((option: string) => 
            option.toLowerCase() === "nil" || option.toLowerCase() === "nil.");
          
          // If not, add it to the options
          if (!hasNil) {
            enhancedQuestion.options = [...question.options, "nil"];
            console.log("Enhanced Question 3 options:", enhancedQuestion.options);
          }
        }

        return (
          <div key={question.id} className="space-y-4">
            <QuestionCard
              id={question.id}
              question={question.question}
              options={enhancedQuestion.options}
              selectedAnswer={predictions?.[question.id] || []}
              helpText={question.help_text}
              responseCategory={question.response_category}
              points={question.points}
              requiredAnswers={question.required_answers}
              onAnswerChange={onAnswerChange}
              disabled={isSubmitted || readOnly}
            />
            {!readOnly && (
              <Textarea
                placeholder="Add a comment about your response (optional)"
                value={comments[question.id] || ''}
                onChange={(e) => handleCommentChange(question.id, e.target.value)}
                className="mt-2"
                disabled={isSubmitted}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
