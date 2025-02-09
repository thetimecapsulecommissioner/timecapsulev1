
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { CompetitionCard } from "@/components/dashboard/CompetitionCard";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const navigate = useNavigate();
  const { firstName, competitions, isLoading } = useDashboardData();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-32 md:pt-32">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-secondary">
            Hi, {firstName}
          </h1>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-2xl font-semibold mb-4 text-secondary">Competitions - click below to play!</h2>
          <div className="space-y-3 md:space-y-4">
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                id={competition.id}
                label={competition.label}
                predictionsCount={competition.predictions_made}
                totalQuestions={competition.total_questions}
                totalEntrants={competition.total_entrants}
                isSealed={competition.predictions_sealed}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
