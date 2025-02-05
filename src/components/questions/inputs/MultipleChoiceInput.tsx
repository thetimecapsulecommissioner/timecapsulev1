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
  const isOptionDisabled = (option: string) => {
    // Special handling for questions 25, 26, and 27
    if ([25, 26, 27].includes(id)) {
      // Check if this option is already selected in the current selection
      const isCurrentlySelected = selected.includes(option);
      // If it's currently selected, allow it to be unchecked
      if (isCurrentlySelected) {
        return disabled;
      }
      // If we've reached the required number of answers, disable unselected options
      if (selected.length >= requiredAnswers) {
        return true;
      }
      return disabled;
    }
    // Default behavior for other questions
    return disabled || (selected.length >= requiredAnswers && !selected.includes(option));
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${id}-${option}`}
            checked={selected.includes(option)}
            disabled={isOptionDisabled(option)}
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