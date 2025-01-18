import { ProfileDropdown } from "./ProfileDropdown";
import { useParams } from "react-router-dom";
import { useCompetition } from "@/hooks/useCompetition";
import { PredictionForm } from "./questions/PredictionForm";
import { LoadingState } from "./ui/LoadingState";

export const Questions = () => {
  const { id: competitionId } = useParams();
  const { data: competition, isLoading } = useCompetition(competitionId);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="fixed top-4 right-4 z-50">
        <ProfileDropdown />
      </div>
      <PredictionForm competitionLabel={competition?.label} />
    </div>
  );
};