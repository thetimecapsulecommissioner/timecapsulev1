import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NumberSelectProps {
  options: string[];
  selected: string[];
  onAnswerChange: (value: string[]) => void;
  disabled?: boolean;
}

export const NumberSelect = ({ options, selected, onAnswerChange, disabled = false }: NumberSelectProps) => {
  return (
    <Select
      value={selected[0]}
      onValueChange={(value) => onAnswerChange([value])}
      disabled={disabled}
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
};