
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CountdownButton } from "../competition-buttons/CountdownButton";
import { usePredictions } from "@/hooks/usePredictions";
import { useEffect, useState } from "react";

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
  const { isSubmitted } = usePredictions();
  
  // Set deadline in the past to lock predictions
  const now = new Date();
  const deadline = new Date(now.getTime() - 1000); // Set deadline to 1 second ago
  
  const { timeLeft: preSeasonTime, formattedTimeLeft: preSeasonTimeLeft } = useCountdown(deadline);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(true);

  // Always set deadline as passed
  useEffect(() => {
    setIsDeadlinePassed(true);
  }, []);

  const isPreSeasonOpen = false; // Force closed state
  const isMidSeasonOpen = false;

  const handlePreSeasonSelect = async () => {
    onPhaseSelect('pre-season');
  };

  return (
    <div className="space-y-4 mt-8">
      <CountdownButton
        label="Pre-Season Predictions"
        isOpen={isPreSeasonOpen}
        timeLeft="Competition Closed"
        onClick={handlePreSeasonSelect}
        disabled={false}
        isSubmitted={isSubmitted}
        forceClosed={true}
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
