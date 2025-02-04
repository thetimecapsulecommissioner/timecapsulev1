import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";

interface PredictionPhaseButtonsProps {
  onPhaseSelect: (phase: 'pre-season' | 'mid-season') => void;
  selectedPhase: 'pre-season' | 'mid-season' | null;
}

export const PredictionPhaseButtons = ({ 
  onPhaseSelect,
  selectedPhase
}: PredictionPhaseButtonsProps) => {
  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const { timeLeft: preSeasonTime, formattedTimeLeft: preSeasonTimeLeft } = useCountdown(preSeasonDeadline);

  const isPreSeasonOpen = !preSeasonTime.expired;
  const isMidSeasonOpen = false; // Hardcoded to false until mid-season is ready

  return (
    <div className="space-y-4 mt-8">
      <Button
        onClick={() => onPhaseSelect('pre-season')}
        className={`w-full h-16 flex justify-between items-center px-6 
          ${selectedPhase === 'pre-season' ? 'bg-mystical-200' : 'bg-mystical-100'} 
          hover:bg-mystical-200 text-primary`}
        disabled={!isPreSeasonOpen}
      >
        <span className="font-semibold w-48">Pre-Season Predictions</span>
        <div className="flex-1 flex justify-center">
          <span className={`px-3 py-1 rounded ${isPreSeasonOpen ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
            {isPreSeasonOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <span className="w-48 text-right">
          {preSeasonTimeLeft}
        </span>
      </Button>

      <Button
        className="w-full h-16 flex justify-between items-center px-6 
          bg-gray-200 text-gray-600 cursor-not-allowed"
        disabled={true}
      >
        <span className="font-semibold w-48">Mid-Season Predictions</span>
        <div className="flex-1 flex justify-center">
          <span className="px-3 py-1 rounded bg-gray-400 text-white">
            Closed
          </span>
        </div>
        <span className="w-48 text-right"></span>
      </Button>
    </div>
  );
};