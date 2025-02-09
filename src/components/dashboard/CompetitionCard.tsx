
import { useNavigate } from "react-router-dom";

interface CompetitionCardProps {
  id: string;
  label: string;
  predictionsCount: number;
  totalQuestions: number;
  totalEntrants: number;
  isSealed: boolean;
  status: string;
}

export const CompetitionCard = ({
  id,
  label,
  predictionsCount,
  totalQuestions,
  totalEntrants,
  isSealed,
  status,
}: CompetitionCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (status) {
      case 'Submitted':
        return "bg-green-100";
      case 'In Progress':
        return "bg-yellow-100";
      default:
        return "bg-red-100";
    }
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
        {totalEntrants} Entrants
      </div>
      <div className="text-gray-600 text-sm md:text-base">
        {status}
      </div>
    </div>
  );
};
