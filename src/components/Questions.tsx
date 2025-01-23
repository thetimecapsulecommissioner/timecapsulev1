import { ProfileDropdown } from "./ProfileDropdown";
import { useParams } from "react-router-dom";
import { useCompetition } from "@/hooks/useCompetition";
import { PredictionForm } from "./questions/PredictionForm";
import { LoadingState } from "./ui/LoadingState";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";

export const Questions = () => {
  const { id: competitionId } = useParams();
  const { data: competition, isLoading } = useCompetition(competitionId);
  const [showTerms, setShowTerms] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const { timeLeft: preSeasonTimeLeft } = useCountdown(preSeasonDeadline);

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
      <div className="fixed top-4 right-4 z-50">
        <ProfileDropdown />
      </div>
      
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <h1 className="text-4xl font-bold text-secondary mb-8 text-center">
          {competition?.label}
        </h1>

        <div className="bg-mystical-100 p-6 rounded-lg mb-8">
          <p className="text-primary text-lg text-center">
            The Original and Central AFL Time Capsule Competition, focussed on determining who truly knows their footy best! 
            Click below to read the terms and conditions and enter this competition, so you can begin making your predictions 
            and try and take home the prize money and shield!
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
            <span className="text-primary font-semibold">Pre-Season Predictions</span>
            <span className="px-3 py-1 rounded bg-green-500 text-white">Open</span>
            <span className="text-primary">
              {preSeasonTimeLeft}
            </span>
          </Button>

          <Button
            disabled
            className="w-full h-16 flex justify-between items-center px-6 bg-gray-200"
          >
            <span className="text-primary font-semibold">Mid-Season Predictions</span>
            <span className="px-3 py-1 rounded bg-gray-400 text-white">Closed</span>
            <span></span>
          </Button>
        </div>

        {!showTerms && hasEntered && <PredictionForm competitionLabel={competition?.label} />}
      </div>
    </div>
  );
};