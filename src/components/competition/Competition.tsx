
import { useParams, useNavigate } from "react-router-dom";
import { useCompetition } from "@/hooks/useCompetition";
import { LoadingState } from "../ui/LoadingState";
import { Logo } from "../navigation/Logo";
import ProfileDropdown from "../ProfileDropdown";

export const Competition = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();
  const { data: competition, isLoading } = useCompetition(competitionId);

  const handleLogoClick = () => {
    navigate("/dashboard");
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
      
      <div className="max-w-4xl mx-auto pt-28 px-4 sm:pt-20">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-primary mb-4">
            {competition?.label || 'Competition Details'}
          </h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              {competition?.description || 'No description available.'}
            </p>
            
            {competition?.rules && (
              <>
                <h2 className="text-xl font-semibold mb-3">Rules</h2>
                <p className="mb-4">{competition.rules}</p>
              </>
            )}
            
            {competition?.prizes && (
              <>
                <h2 className="text-xl font-semibold mb-3">Prizes</h2>
                <p className="mb-4">{competition.prizes}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
