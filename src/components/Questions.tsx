import { ProfileDropdown } from "./ProfileDropdown";
import { useParams } from "react-router-dom";
import { useCompetition } from "@/hooks/useCompetition";
import { PredictionForm } from "./questions/PredictionForm";
import { LoadingState } from "./ui/LoadingState";
import { Logo } from "./navigation/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { supabase } from "@/integrations/supabase/client";
import { CompetitionButtons } from "./questions/CompetitionButtons";
import { TermsAndConditionsDialog } from "./questions/TermsAndConditionsDialog";

export const Questions = () => {
  const { id: competitionId } = useParams();
  const { data: competition, isLoading } = useCompetition(competitionId);
  const [showTerms, setShowTerms] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const navigate = useNavigate();

  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const { timeLeft: preSeasonTimeLeft } = useCountdown(preSeasonDeadline);

  const handleLogoClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="fixed top-4 left-4 z-50">
        <Logo onClick={handleLogoClick} />
      </div>
      <div className="fixed top-4 right-4 z-50">
        <ProfileDropdown />
      </div>
      
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <h1 className="text-4xl font-bold text-secondary mb-8 text-center">
          {competition?.label}
        </h1>

        <div className="bg-mystical-100 p-6 rounded-lg mb-8">
          <p className="text-primary text-lg text-center">
            The Original AFL Time Capsule, focussed on finding out who truly is the biggest footy nuff!{' '}
            <br />
            Click below to read the terms and conditions and enter this competition, to start making your predictions 
            and put yourself in with a chance to win the prize-money and coveted Time Capsule Shield!
          </p>
        </div>

        <CompetitionButtons
          hasEntered={hasEntered}
          preSeasonTimeLeft={preSeasonTimeLeft}
          onEnterCompetition={() => setHasEntered(true)}
          onShowTerms={() => setShowTerms(true)}
        />

        <TermsAndConditionsDialog
          open={showTerms}
          onOpenChange={setShowTerms}
        />

        {!showTerms && hasEntered && <PredictionForm competitionLabel={competition?.label} />}
      </div>
    </div>
  );
};