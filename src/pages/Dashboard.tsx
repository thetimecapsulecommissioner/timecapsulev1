import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";

interface Competition {
  id: string;
  label: string;
  total_questions: number;
  status: string;
}

interface CompetitionWithStats extends Competition {
  predictions_made: number;
  total_entrants: number;
  predictions_sealed: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");

  const { data: competitions = [], isLoading } = useQuery({
    queryKey: ['dashboard-competitions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return [];
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.first_name) {
        setFirstName(profile.first_name);
      }

      // Fetch competitions
      const { data: competitionsData } = await supabase
        .from("competitions")
        .select("*");

      if (!competitionsData) return [];

      // Fetch competition entries for the user
      const enhancedCompetitions = await Promise.all(
        competitionsData.map(async (comp) => {
          // Get predictions for this user
          const { data: predictions } = await supabase
            .from("predictions")
            .select("question_id, submitted")
            .eq("user_id", user.id);

          // Get unique question IDs that have been answered
          const uniqueAnsweredQuestions = new Set(predictions?.map(p => p.question_id));
          
          // Check if predictions are sealed
          const predictionsSealed = predictions?.some(p => p.submitted) || false;

          // Get total number of entrants
          const { data: entries } = await supabase
            .from("competition_entries")
            .select("*")
            .eq("competition_id", comp.id);

          return {
            ...comp,
            predictions_made: uniqueAnsweredQuestions.size,
            total_questions: comp.total_questions,
            total_entrants: entries?.length || 0,
            predictions_sealed: predictionsSealed
          };
        })
      );

      return enhancedCompetitions;
    },
  });

  const getStatusColor = (competition: CompetitionWithStats) => {
    if (competition.predictions_sealed) {
      return "bg-green-100";
    }
    if (competition.predictions_made > 0) {
      return "bg-yellow-100";
    }
    return "bg-red-100";
  };

  const getStatusText = (competition: CompetitionWithStats) => {
    if (competition.predictions_sealed) {
      return "Completed";
    }
    if (competition.predictions_made > 0) {
      return "In Progress";
    }
    return "Not Started";
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-28">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">
            Hi, {firstName}
          </h1>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-secondary">Competitions</h2>
          <div className="space-y-4">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                onClick={() => navigate(`/competition/${competition.id}`)}
                className={`${getStatusColor(competition)} 
                  p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity
                  grid grid-cols-4 gap-4 items-center`}
              >
                <div className="font-semibold text-gray-800">
                  {competition.label}
                </div>
                <div className="text-gray-600">
                  {competition.predictions_made}/{competition.total_questions} Predictions Made
                </div>
                <div className="text-gray-600">
                  {competition.total_entrants} Entrants
                </div>
                <div className="text-gray-600">
                  {getStatusText(competition)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;