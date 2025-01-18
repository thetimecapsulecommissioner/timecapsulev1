import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StateSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const StateSelect = ({ value, onChange }: StateSelectProps) => {
  const australianStates = [
    "Victoria",
    "New South Wales",
    "Queensland",
    "Western Australia",
    "South Australia",
    "Tasmania",
    "Northern Territory",
    "Australian Capital Territory",
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a state" className="text-gray-700" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {australianStates.map((state) => (
            <SelectItem key={state} value={state} className="text-gray-700">
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};