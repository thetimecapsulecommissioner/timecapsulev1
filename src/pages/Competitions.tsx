
import { Navigation } from "@/components/Navigation";
import { CompetitionCard } from "@/components/dashboard/CompetitionCard";
import { useDashboardData } from "@/hooks/useDashboardData";

const Competitions = () => {
  const { competitions, isLoading } = useDashboardData();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-32">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
          My Competitions
        </h1>
        
        <div className="bg-primary/10 rounded-lg p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {competitions.length > 0 ? (
              competitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  id={competition.id}
                  label={competition.label}
                  predictionsCount={competition.predictions_made}
                  totalQuestions={competition.total_questions}
                  totalEntrants={competition.total_entrants}
                  isSealed={competition.predictions_sealed}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">You haven't entered any competitions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Competitions;
