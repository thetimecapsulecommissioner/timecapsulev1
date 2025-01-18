import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionCardProps {
  id: number;
  question: string;
  options: string[];
  selectedAnswer: string;
  onAnswerChange: (questionId: number, value: string) => void;
}

export const QuestionCard = ({ 
  id, 
  question, 
  options, 
  selectedAnswer, 
  onAnswerChange 
}: QuestionCardProps) => {
  return (
    <Card className="p-6 bg-mystical-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">{question}</h3>
      <RadioGroup
        onValueChange={(value) => onAnswerChange(id, value)}
        value={selectedAnswer}
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
    </Card>
  );
};