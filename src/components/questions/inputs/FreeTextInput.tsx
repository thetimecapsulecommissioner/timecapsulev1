import { Textarea } from "@/components/ui/textarea";

interface FreeTextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const FreeTextInput = ({
  value,
  onChange,
  disabled = false
}: FreeTextInputProps) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Enter your response..."
      className="w-full min-h-[100px]"
    />
  );
};