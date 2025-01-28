import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MultipleChoiceInputProps {
  id: number;
  options: string[];
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
}

export const MultipleChoiceInput = ({ 
  id, 
  options, 
  selected, 
  requiredAnswers,
  onAnswerChange 
}: MultipleChoiceInputProps) => {
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
              onAnswerChange(newSelected);
            }}
          />
          <Label htmlFor={`${id}-${option}`} className="text-gray-700">{option}</Label>
        </div>
      ))}
    </div>
  );
};