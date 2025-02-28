
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MultipleChoiceInputProps {
  id: number;
  options: string[];
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[], responseOrder?: number) => void;
  disabled?: boolean;
  allSelectedAnswers?: string[];
}

export const MultipleChoiceInput = ({ 
  id, 
  options, 
  selected, 
  requiredAnswers,
  onAnswerChange,
  disabled = false,
  allSelectedAnswers = []
}: MultipleChoiceInputProps) => {
  const isOptionDisabled = (option: string) => {
    // Special case for "nil" option - always allow selecting it regardless of other selections
    if (option.toLowerCase() === "nil") {
      return disabled;
    }
    
    // If nil is already selected, disable all other options
    if (selected.some(item => item.toLowerCase() === "nil")) {
      return option.toLowerCase() !== "nil" || disabled;
    }
    
    // Special handling for questions 25, 26, and 27
    if ([25, 26, 27].includes(id)) {
      // If this option is already selected in current selection, allow unchecking
      if (selected.includes(option)) {
        return disabled;
      }
      // If this option is selected in another response set, disable it
      if (allSelectedAnswers.includes(option) && !selected.includes(option)) {
        return true;
      }
      // If we've reached the required number of answers for this response set
      if (selected.length >= requiredAnswers) {
        return true;
      }
      return disabled;
    }
    // Default behavior for other questions
    return disabled || (selected.length >= requiredAnswers && !selected.includes(option));
  };

  const handleOptionChange = (checked: boolean, option: string) => {
    if (disabled) return;
    
    const currentIndex = selected.indexOf(option);
    let newSelected: string[];
    
    // Special handling for "nil" option
    if (option.toLowerCase() === "nil" && checked) {
      // If selecting "nil", clear all other selections
      newSelected = [option];
      onAnswerChange(newSelected, 1);
      return;
    }
    
    // If selecting a regular option while "nil" is selected, remove "nil"
    if (checked && selected.some(item => item.toLowerCase() === "nil")) {
      newSelected = selected.filter(item => item.toLowerCase() !== "nil");
      newSelected.push(option);
      onAnswerChange(newSelected, selected.length);
      return;
    }
    
    // Regular option handling
    if (checked) {
      if (currentIndex === -1 && selected.length < requiredAnswers) {
        newSelected = [...selected, option];
        onAnswerChange(newSelected, selected.length + 1);
      }
    } else {
      newSelected = selected.filter(item => item !== option);
      onAnswerChange(newSelected);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${id}-${option}`}
            checked={selected.includes(option)}
            disabled={isOptionDisabled(option)}
            onCheckedChange={(checked) => handleOptionChange(!!checked, option)}
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
