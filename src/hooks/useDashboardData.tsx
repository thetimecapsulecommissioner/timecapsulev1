import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const useDashboardData = () => {
  const [firstName, setFirstName] = useState<string>("");

  const { data: competitions = [], isLoading } = useQuery({
    queryKey: ['dashboard-competitions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
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
            .eq("user_id", user.id)
            .not('question_id', 'is', null);

          // Get unique question IDs that have been answered
          const uniqueAnsweredQuestions = new Set(
            predictions?.map(p => p.question_id) || []
          );
          
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
            total_questions: 29,
            total_entrants: entries?.length || 0,
            predictions_sealed: predictionsSealed
          };
        })
      );

      return enhancedCompetitions;
    },
  });

  return {
    firstName,
    competitions,
    isLoading
  };
};