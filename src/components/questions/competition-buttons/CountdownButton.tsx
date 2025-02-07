
import { Button } from "@/components/ui/button";

interface CountdownButtonProps {
  label: string;
  isOpen: boolean;
  timeLeft: string;
  onClick?: () => void;
  disabled?: boolean;
  isSubmitted?: boolean;
}

export const CountdownButton = ({
  label,
  isOpen,
  timeLeft,
  onClick,
  disabled = false,
  isSubmitted = false
}: CountdownButtonProps) => {
  const getStatusLabel = () => {
    if (isSubmitted) return 'Submitted';
    return isOpen ? 'Open' : 'Closed';
  };

  const getStatusColor = () => {
    if (isSubmitted) return 'bg-blue-500';
    return isOpen ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isSubmitted}
      className="w-full h-16 flex justify-between items-center px-6 bg-mystical-100 hover:bg-mystical-200"
    >
      <span className="text-primary font-semibold w-48">{label}</span>
      <div className="flex-1 flex justify-center">
        <span className={`px-3 py-1 rounded ${getStatusColor()} text-white`}>
          {getStatusLabel()}
        </span>
      </div>
      <span className="text-primary w-48 text-right">
        {timeLeft}
      </span>
    </Button>
  );
};
