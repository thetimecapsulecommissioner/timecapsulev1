
import { Button } from "@/components/ui/button";
import { CompetitionStatus } from "@/hooks/useDashboardData";

interface CountdownButtonProps {
  label: string;
  isOpen: boolean;
  timeLeft: string;
  onClick?: () => void;
  disabled?: boolean;
  isSubmitted?: boolean;
  status?: CompetitionStatus;
}

export const CountdownButton = ({
  label,
  isOpen,
  timeLeft,
  onClick,
  disabled = false,
  isSubmitted = false,
  status
}: CountdownButtonProps) => {
  const getStatusText = () => {
    if (status) return status;
    
    // Fallback logic if status is not provided
    if (isSubmitted) return 'In Progress';
    return isOpen ? 'In Progress' : 'Closed';
  };

  const getStatusClass = () => {
    if (status) {
      switch (status) {
        case 'Not Entered':
          return 'bg-red-500 text-white';
        case 'In Progress':
          return 'bg-yellow-500 text-white';
        case 'Closed':
          return 'bg-red-500 text-white';
        default:
          return 'bg-gray-500 text-white';
      }
    }
    
    // Fallback logic if status is not provided
    if (isSubmitted) return 'bg-yellow-500 text-white';
    return isOpen ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white';
  };

  console.log(`CountdownButton rendering with status: ${status}, resulting in class: ${getStatusClass()}`);

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
