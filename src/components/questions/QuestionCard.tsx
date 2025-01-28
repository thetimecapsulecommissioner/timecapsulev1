import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

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
    if (responseCategory === "Multiple Choice" || responseCategory === "AFL Clubs") {
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
    if (responseCategory === "AFL Clubs") {
      return (
        <div className="space-y-3">
          {Array.from({ length: requiredAnswers || 1 }).map((_, index) => (
            <div key={index} className="w-full">
              <Select
                value={selected[index] || ""}
                onValueChange={(value) => {
                  const newSelected = [...selected];
                  newSelected[index] = value;
                  handleAnswerChange(newSelected.filter(Boolean));
                }}
              >
                <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300">
                  <SelectValue placeholder="Select AFL Club" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {options.map((club) => (
                    <SelectItem 
                      key={club} 
                      value={club}
                      className="text-gray-700 hover:bg-gray-100"
                    >
                      {club}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      );
    } else if (responseCategory === "Multiple Choice") {
      return (
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${id}-${option}`}
                checked={selected.includes(option)}
                onCheckedChange={(checked) => {
                  const newSelected = checked
                    ? [...selected, option].slice(0, requiredAnswers)
                    : selected.filter(item => item !== option);
                  handleAnswerChange(newSelected);
                }}
              />
              <Label htmlFor={`${id}-${option}`} className="text-gray-700">{option}</Label>
            </div>
          ))}
        </div>
      );
    } else if (responseCategory === "Number") {
      return (
        <Select
          value={selected[0]}
          onValueChange={(value) => handleAnswerChange([value])}
        >
          <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300">
            <SelectValue placeholder="Select a number" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {options.map((option) => (
              <SelectItem 
                key={option} 
                value={option}
                className="text-gray-700 hover:bg-gray-100"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else {
      return (
        <RadioGroup
          onValueChange={(value) => handleAnswerChange([value])}
          value={selected[0]}
        >
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${id}-${option}`} />
                <Label htmlFor={`${id}-${option}`} className="text-gray-700">{option}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );
    }
  };

  return (
    <Card className="p-6 bg-mystical-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start space-x-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-700 flex-grow pr-2">{question}</h3>
        <div className="flex items-start space-x-2">
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-5 w-5 text-gray-500 mt-1" />
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p className="text-gray-700">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {points !== undefined && (
            <span className="text-sm font-medium text-gray-600 mt-1">
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