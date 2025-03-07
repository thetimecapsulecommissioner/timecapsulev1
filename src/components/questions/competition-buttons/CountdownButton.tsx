
import { Button } from "@/components/ui/button";

interface CountdownButtonProps {
  label: string;
  isOpen: boolean;
  timeLeft: string;
  onClick?: () => void;
  disabled?: boolean;
  isSubmitted?: boolean;
  forceClosed?: boolean;
}

export const CountdownButton = ({
  label,
  isOpen,
  timeLeft,
  onClick,
  disabled = false,
  isSubmitted = false,
  forceClosed = false
}: CountdownButtonProps) => {
  const getStatusText = () => {
    if (isSubmitted) return 'Submitted';
    if (forceClosed) return 'Closed';
    return isOpen ? 'Open' : 'Closed';
  };

  const getStatusClass = () => {
    if (isSubmitted) return 'bg-blue-500 text-white';
    if (forceClosed) return 'bg-red-500 text-white';
    return isOpen ? 'bg-green-500 text-white' : 'bg-gray-400 text-white';
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-16 flex justify-between items-center px-6 bg-mystical-100 hover:bg-mystical-200"
    >
      <span className="text-primary font-semibold w-48">{label}</span>
      <div className="flex-1 flex justify-center">
        <span className={`px-3 py-1 rounded ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>
      <span className="text-primary w-48 text-right">
        {timeLeft}
      </span>
    </Button>
  );
};
