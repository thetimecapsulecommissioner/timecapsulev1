import { Card } from "@/components/ui/card";
import { useState } from "react";
import { QuestionHeader } from "./QuestionHeader";
import { QuestionInput } from "./inputs/QuestionInput";

interface QuestionCardProps {
  id: number;
  question: string;
  options: string[];
  selectedAnswer: string[];
  helpText?: string;
  responseCategory?: string;
  points?: number;
  requiredAnswers?: number;
  onAnswerChange: (questionId: number, value: string[], responseOrder?: number) => void;
  disabled?: boolean;
}

export const QuestionCard = ({ 
  id, 
  question, 
  options, 
  selectedAnswer = [],
  helpText,
  responseCategory,
  points,
  requiredAnswers = 1,
  onAnswerChange,
  disabled = false
}: QuestionCardProps) => {
  const [selected, setSelected] = useState<string[]>(selectedAnswer);

  const handleAnswerChange = (value: string[], responseOrder?: number) => {
    if (disabled) return;
    
    if (["Multiple Choice", "AFL Teams", "AFL Players", "AFL Coaches"].includes(responseCategory || "")) {
      if (value.length <= requiredAnswers) {
        setSelected(value);
        onAnswerChange(id, value, responseOrder);
      }
    } else {
      setSelected(value);
      onAnswerChange(id, value, responseOrder);
    }
  };

  return (
    <Card className="p-6 bg-mystical-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <QuestionHeader 
        question={question}
        helpText={helpText}
        points={points}
      />
      {requiredAnswers > 1 && (
        <p className="text-sm text-gray-500 mb-4">
          Select {requiredAnswers} answers
        </p>
      )}
      <QuestionInput
        id={id}
        responseCategory={responseCategory}
        options={options}
        selected={selected}
        requiredAnswers={requiredAnswers}
        onAnswerChange={handleAnswerChange}
        disabled={disabled}
      />
    </Card>
  );
};