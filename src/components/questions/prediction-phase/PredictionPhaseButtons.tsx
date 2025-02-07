
import { useCountdown } from "@/hooks/useCountdown";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CountdownButton } from "../competition-buttons/CountdownButton";
import { useQuery } from "@tanstack/react-query";

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

  const { data: userData } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: entryStatus } = useQuery({
    queryKey: ['entry-status', competitionId, userData?.id],
    queryFn: async () => {
      if (!userData?.id || !competitionId) return null;
      const { data } = await supabase
        .from('competition_entries')
        .select('status')
        .eq('user_id', userData.id)
        .eq('competition_id', competitionId)
        .maybeSingle();
      return data?.status === 'Submitted';
    },
    enabled: !!userData?.id && !!competitionId,
  });

  const isPreSeasonOpen = !preSeasonTime.expired;
  const isMidSeasonOpen = false;

  const handlePreSeasonSelect = () => {
    // Allow selection if either predictions are open OR the user has already submitted
    onPhaseSelect('pre-season');
  };

  return (
    <div className="space-y-4 mt-8">
      <CountdownButton
        label="Pre-Season Predictions"
        isOpen={isPreSeasonOpen || !!entryStatus}
        timeLeft={preSeasonTimeLeft}
        onClick={handlePreSeasonSelect}
        disabled={false} // Never disable the button as we want users to be able to view their predictions
        isSubmitted={!!entryStatus}
      />

      <CountdownButton
        label="Mid-Season Predictions"
        isOpen={isMidSeasonOpen}
        timeLeft="Coming Soon"
        disabled={true}
      />
    </div>
  );
};
