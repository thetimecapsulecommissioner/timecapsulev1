import { ProfileDropdown } from "./ProfileDropdown";
import { useParams } from "react-router-dom";
import { useCompetition } from "@/hooks/useCompetition";
import { PredictionForm } from "./questions/PredictionForm";
import { LoadingState } from "./ui/LoadingState";
import { Button } from "./ui/button";
import { Logo } from "./navigation/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { supabase } from "@/integrations/supabase/client";

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

  const handleEnterCompetition = () => {
    setHasEntered(true);
  };

  const handleShowTerms = () => {
    setShowTerms(true);
  };

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

        <div className="flex gap-4 justify-center mb-12">
          <Button
            onClick={handleEnterCompetition}
            className="flex-1 bg-secondary hover:bg-secondary-light text-primary"
          >
            Enter this Competition
          </Button>
          <Button
            onClick={handleShowTerms}
            variant="outline"
            className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
          >
            Terms and Conditions
          </Button>
        </div>

        <div className="space-y-4 mt-12">
          <Button
            className={`w-full h-16 flex justify-between items-center px-6 
              ${hasEntered ? 'bg-green-100 hover:bg-green-200' : 'bg-secondary hover:bg-secondary-light'}`}
            onClick={() => hasEntered && setShowTerms(false)}
          >
            <span className="text-primary font-semibold w-48">Pre-Season Predictions</span>
            <div className="flex-1 flex justify-center">
              <span className="px-3 py-1 rounded bg-green-500 text-white">Open</span>
            </div>
            <span className="text-primary w-48 text-right">
              {preSeasonTimeLeft}
            </span>
          </Button>

          <Button
            disabled
            className="w-full h-16 flex justify-between items-center px-6 bg-gray-200"
          >
            <span className="text-primary font-semibold w-48">Mid-Season Predictions</span>
            <div className="flex-1 flex justify-center">
              <span className="px-3 py-1 rounded bg-gray-400 text-white">Closed</span>
            </div>
            <span className="w-48"></span>
          </Button>
        </div>

        {!showTerms && hasEntered && <PredictionForm competitionLabel={competition?.label} />}
      </div>
    </div>
  );
};