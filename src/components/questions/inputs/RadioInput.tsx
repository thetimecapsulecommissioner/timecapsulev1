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
  return (
    <RadioGroup
      onValueChange={(value) => onAnswerChange([value])}
      value={selected[0]}
      disabled={disabled}
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
};