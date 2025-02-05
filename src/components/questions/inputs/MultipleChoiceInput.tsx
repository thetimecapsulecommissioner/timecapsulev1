import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MultipleChoiceInputProps {
  id: number;
  options: string[];
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[], responseOrder?: number) => void;
  disabled?: boolean;
}

export const MultipleChoiceInput = ({ 
  id, 
  options, 
  selected, 
  requiredAnswers,
  onAnswerChange,
  disabled = false
}: MultipleChoiceInputProps) => {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${id}-${option}`}
            checked={selected.includes(option)}
            disabled={disabled || (selected.length >= requiredAnswers && !selected.includes(option))}
            onCheckedChange={(checked) => {
              if (disabled) return;
              
              const currentIndex = selected.indexOf(option);
              let newSelected: string[];
              
              if (checked) {
                if (currentIndex === -1 && selected.length < requiredAnswers) {
                  newSelected = [...selected, option];
                  onAnswerChange(newSelected, selected.length + 1);
                }
              } else {
                newSelected = selected.filter(item => item !== option);
                onAnswerChange(newSelected);
              }
            }}
          />
          <Label 
            htmlFor={`${id}-${option}`} 
            className={`text-gray-700 ${disabled ? 'opacity-50' : ''}`}
          >
            {option}
          </Label>
        </div>
      ))}
    </div>
  );
};