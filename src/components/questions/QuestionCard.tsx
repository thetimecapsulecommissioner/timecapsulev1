import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { AFLTeamSelect } from "./inputs/AFLTeamSelect";
import { MultipleChoiceInput } from "./inputs/MultipleChoiceInput";
import { NumberSelect } from "./inputs/NumberSelect";
import { RadioInput } from "./inputs/RadioInput";
import { AFLPlayerSelect } from "./inputs/AFLPlayerSelect";
import { AFLCoachSelect } from "./inputs/AFLCoachSelect";

interface QuestionCardProps {
  id: number;
  question: string;
  options: string[];
  selectedAnswer: string[];
  helpText?: string;
  responseCategory?: string;
  points?: number;
  requiredAnswers?: number;
  onAnswerChange: (questionId: number, value: string[]) => void;
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
  onAnswerChange 
}: QuestionCardProps) => {
  const [selected, setSelected] = useState<string[]>(selectedAnswer);

  const handleAnswerChange = (value: string[]) => {
    if (["Multiple Choice", "AFL Teams", "AFL Players", "AFL Coaches"].includes(responseCategory || "")) {
      if (value.length <= requiredAnswers) {
        setSelected(value);
        onAnswerChange(id, value);
      }
    } else {
      setSelected(value);
      onAnswerChange(id, value);
    }
  };

  const renderAnswerInput = () => {
    switch (responseCategory) {
      case "AFL Teams":
        return (
          <AFLTeamSelect
            selected={selected}
            requiredAnswers={requiredAnswers}
            onAnswerChange={handleAnswerChange}
          />
        );
      case "AFL Players":
        return (
          <AFLPlayerSelect
            selected={selected}
            requiredAnswers={requiredAnswers}
            onAnswerChange={handleAnswerChange}
          />
        );
      case "AFL Coaches":
        return (
          <AFLCoachSelect
            selected={selected}
            requiredAnswers={requiredAnswers}
            onAnswerChange={handleAnswerChange}
          />
        );
      case "Multiple Choice":
        return (
          <MultipleChoiceInput
            id={id}
            options={options}
            selected={selected}
            requiredAnswers={requiredAnswers}
            onAnswerChange={handleAnswerChange}
          />
        );
      case "Number":
        return (
          <NumberSelect
            options={options}
            selected={selected}
            onAnswerChange={handleAnswerChange}
          />
        );
      default:
        return (
          <RadioInput
            id={id}
            options={options}
            selected={selected}
            onAnswerChange={handleAnswerChange}
          />
        );
    }
  };

  return (
    <Card className="p-6 bg-mystical-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-700 flex-grow">{question}</h3>
        <div className="flex items-start space-x-2 ml-2 flex-shrink-0">
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-5 w-5 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p className="text-gray-700">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {points !== undefined && (
            <span className="text-sm font-medium text-gray-600">
              {points} Points
            </span>
          )}
        </div>
      </div>
      {requiredAnswers > 1 && (
        <p className="text-sm text-gray-500 mb-4">
          Select {requiredAnswers} answers
        </p>
      )}
      {renderAnswerInput()}
    </Card>
  );
};