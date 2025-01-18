import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";

interface Competition {
  id: string;
  label: string;
  total_questions: number;
  status: string;
}

interface CompetitionEntry {
  competition_id: string;
  questions_completed: number;
}

interface CompetitionWithStats extends Competition {
  questions_completed: number;
  total_entrants: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [competitions, setCompetitions] = useState<CompetitionWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndCompetitions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        // Fetch user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();

        if (profile?.name) {
          const firstName = profile.name.split(" ")[0];
          setUserName(firstName);
        }

        // Fetch competitions with entries
        const { data: competitionsData } = await supabase
          .from("competitions")
          .select("*");

        if (competitionsData) {
          // Fetch entries for each competition
          const enhancedCompetitions = await Promise.all(
            competitionsData.map(async (comp) => {
              const { data: entries } = await supabase
                .from("competition_entries")
                .select("*")
                .eq("competition_id", comp.id);

              const userEntry = entries?.find(entry => entry.user_id === user.id);

              return {
                ...comp,
                questions_completed: userEntry?.questions_completed || 0,
                total_entrants: entries?.length || 0
              };
            })
          );

          setCompetitions(enhancedCompetitions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCompetitions();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100";
      case "in progress":
        return "bg-yellow-100";
      case "not started":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-28">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Hi, {userName}
          </h1>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Competitions</h2>
          <div className="space-y-4">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                onClick={() => navigate(`/competition/${competition.id}`)}
                className={`${getStatusColor(competition.status)} 
                  p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity
                  grid grid-cols-4 gap-4 items-center`}
              >
                <div className="font-semibold text-gray-800">{competition.label}</div>
                <div className="text-gray-600">
                  {competition.questions_completed} / {competition.total_questions} Questions
                </div>
                <div className="text-gray-600">
                  {competition.total_entrants} Entrants
                </div>
                <div className="text-gray-600">
                  {competition.status}
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