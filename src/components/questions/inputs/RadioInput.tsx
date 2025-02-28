
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioInputProps {
  id: number;
  options: string[];
  selected: string[];
  onAnswerChange: (value: string[]) => void;
  disabled?: boolean;
}

export const RadioInput = ({ id, options, selected, onAnswerChange, disabled = false }: RadioInputProps) => {
  // Check if this is Question 3
  const isQuestion3 = id === 3;
  
  // Create a new array with the enhanced options to ensure React re-renders
  let displayOptions = [...options];
  
  // For Question 3, make sure "nil" is included
  if (isQuestion3) {
    // Only add "nil" if it's not already in the list
    const hasNil = options.some(option => 
      option.toLowerCase() === "nil" || option.toLowerCase() === "nil.");
      
    if (!hasNil) {
      displayOptions.push("nil");
    }
    
    console.log(`Question 3 options with nil:`, displayOptions);
  }

  return (
    <RadioGroup
      onValueChange={(value) => onAnswerChange([value])}
      value={selected[0]}
      disabled={disabled}
    >
      <div className="space-y-3">
        {displayOptions.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${id}-${option}`} />
            <Label htmlFor={`${id}-${option}`} className="text-gray-700">{option}</Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};
