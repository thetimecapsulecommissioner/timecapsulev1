
import { useNavigate } from "react-router-dom";

interface CompetitionCardProps {
  id: string;
  label: string;
  predictionsCount: number;
  totalQuestions: number;
  totalEntrants: number;
  isSealed: boolean;
  status: string;
  isExpired?: boolean;
  hasEntered?: boolean;
}

export const CompetitionCard = ({
  id,
  label,
  predictionsCount,
  totalQuestions,
  totalEntrants,
  isSealed,
  status,
  isExpired = false,
  hasEntered = false,
}: CompetitionCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    // First handle expired/closed state
    if (isExpired) {
      return hasEntered ? "bg-green-100" : "bg-red-100"; // Green for closed competitions user entered, red for those they didn't
    }
    
    // If not expired, handle normal states
    switch (status) {
      case 'Submitted':
        return "bg-green-100";
      case 'In Progress':
        return "bg-yellow-100";
      case 'Not Entered':
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusText = () => {
    // If competition is expired, display the appropriate status
    if (isExpired) {
      return hasEntered ? "Closed" : "Expired"; 
    }
    
    // If not expired, show the current status
    return status;
  };

  return (
    <div
      onClick={() => navigate(`/competition/${id}`)}
      className={`${getStatusColor()} 
        p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity
        grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center`}
    >
      <div className="font-semibold text-gray-800 text-sm md:text-base">
        {label}
      </div>
      <div className="text-gray-600 text-sm md:text-base">
        {predictionsCount}/{totalQuestions} Predictions Made
      </div>
      <div className="text-gray-600 text-sm md:text-base">
        {totalEntrants} {totalEntrants === 1 ? 'Entrant' : 'Entrants'}
      </div>
      <div className="text-gray-600 text-sm md:text-base">
        {getStatusText()}
      </div>
    </div>
  );
};
