
import React from "react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CountdownButton } from "../competition-buttons/CountdownButton";
import { usePredictions } from "@/hooks/usePredictions";

interface PredictionPhaseButtonsProps {
  onPhaseSelect: (phase: 'pre-season' | 'mid-season') => void;
  selectedPhase: 'pre-season' | 'mid-season' | null;
  onTimeStatusChange?: (isExpired: boolean) => void;
}

export const PredictionPhaseButtons = ({ 
  onPhaseSelect,
  selectedPhase,
  onTimeStatusChange
}: PredictionPhaseButtonsProps) => {
  const navigate = useNavigate();
  const { id: competitionId } = useParams();
  const { isSubmitted } = usePredictions();
  const preSeasonDeadline = new Date('2025-03-06T23:59:00+11:00');
  const { timeLeft: preSeasonTime, formattedTimeLeft: preSeasonTimeLeft } = useCountdown(preSeasonDeadline);

  const isPreSeasonOpen = !preSeasonTime.expired;
  const isMidSeasonOpen = false;

  // Call the callback whenever the time status changes
  React.useEffect(() => {
    if (onTimeStatusChange) {
      onTimeStatusChange(preSeasonTime.expired);
    }
  }, [preSeasonTime.expired, onTimeStatusChange]);

  const handlePreSeasonSelect = async () => {
    onPhaseSelect('pre-season');
  };

  return (
    <div className="space-y-4 mt-8">
      <CountdownButton
        label="Pre-Season Predictions"
        isOpen={isPreSeasonOpen}
        timeLeft={isPreSeasonOpen ? preSeasonTimeLeft : "Closed"}
        onClick={handlePreSeasonSelect}
        disabled={false}
        isSubmitted={isSubmitted}
        isExpired={!isPreSeasonOpen}
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
