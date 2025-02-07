
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PredictionPhaseButtonsProps {
  onPhaseSelect: (phase: 'pre-season' | 'mid-season') => void;
  selectedPhase: 'pre-season' | 'mid-season' | null;
}

export const PredictionPhaseButtons = ({ 
  onPhaseSelect,
  selectedPhase
}: PredictionPhaseButtonsProps) => {
  const navigate = useNavigate();
  const { id: competitionId } = useParams();
  const preSeasonDeadline = new Date('2025-03-05T18:00:00+11:00');
  const { timeLeft: preSeasonTime, formattedTimeLeft: preSeasonTimeLeft } = useCountdown(preSeasonDeadline);

  const isPreSeasonOpen = !preSeasonTime.expired;
  const isMidSeasonOpen = false;

  const handlePreSeasonSelect = async () => {
    if (!isPreSeasonOpen) {
      toast.error("Pre-season predictions are now closed");
      return;
    }

    if (preSeasonTime.expired) {
      // Auto-seal any unsaved predictions
      const { data: { user } } = await supabase.auth.getUser();
      if (user && competitionId) {
        await supabase
          .from('competition_entries')
          .update({ status: 'Submitted' })
          .eq('user_id', user.id)
          .eq('competition_id', competitionId);
        
        toast.success("Pre-season predictions have been automatically sealed as the deadline has passed");
        navigate("/dashboard");
        return;
      }
    }

    onPhaseSelect('pre-season');
  };

  return (
    <div className="space-y-4 mt-8">
      <Button
        onClick={handlePreSeasonSelect}
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
