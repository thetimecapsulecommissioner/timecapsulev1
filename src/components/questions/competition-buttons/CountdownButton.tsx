
import { Button } from "@/components/ui/button";
import { CompetitionStatus, determineCompetitionStatus } from "@/hooks/useDashboardData";

interface CountdownButtonProps {
  label: string;
  isOpen: boolean;
  timeLeft: string;
  onClick?: () => void;
  disabled?: boolean;
  isSubmitted?: boolean;
  status?: CompetitionStatus;
  isExpired?: boolean;
}

export const CountdownButton = ({
  label,
  isOpen,
  timeLeft,
  onClick,
  disabled = false,
  isSubmitted = false,
  status,
  isExpired = false
}: CountdownButtonProps) => {
  // If status is provided directly, use it, otherwise determine it from props
  const effectiveStatus: CompetitionStatus = status || determineCompetitionStatus(isExpired, isSubmitted);

  const getStatusClass = () => {
    switch (effectiveStatus) {
      case 'Not Entered':
        return 'bg-red-500 text-white';
      case 'In Progress':
        return 'bg-yellow-500 text-white';
      case 'Closed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  console.log(`CountdownButton rendering with status: ${effectiveStatus}, expired: ${isExpired}, resulting in class: ${getStatusClass()}`);

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-16 flex justify-between items-center px-6 bg-mystical-100 hover:bg-mystical-200"
    >
      <span className="text-primary font-semibold w-48">{label}</span>
      <div className="flex-1 flex justify-center">
        <span className={`px-3 py-1 rounded ${getStatusClass()}`}>
          {effectiveStatus}
        </span>
      </div>
      <span className="text-primary w-48 text-right">
        {timeLeft}
      </span>
    </Button>
  );
};
