
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
          // Get competition entry status and predictions
          const { data: entry } = await supabase
            .from("competition_entries")
            .select("*")
            .eq("user_id", user.id)
            .eq("competition_id", comp.id)
            .maybeSingle();

          console.log('Competition Entry:', {
            competitionId: comp.id,
            entry,
            userId: user.id
          });

          // Get predictions for this user
          const { data: predictions } = await supabase
            .from("predictions")
            .select("question_id")
            .eq("user_id", user.id)
            .not('question_id', 'is', null);

          // Get unique question IDs that have been answered
          const uniqueAnsweredQuestions = new Set(
            predictions?.map(p => p.question_id) || []
          );

          // Check entry status
          const hasStarted = entry?.terms_accepted || false;
          const isSubmitted = entry?.status === 'Submitted';
          let status = 'Not Started';
          
          if (isSubmitted) {
            status = 'Submitted';
          } else if (hasStarted) {
            status = 'In Progress';
          }

          // Get total number of unique users who have made predictions
          // This counts any user who has answered at least one question
          const { data: userPredictions, error } = await supabase
            .from("predictions")
            .select("user_id", { count: "exact", head: true })
            .eq("question_id", 1); // Using question_id=1 as a reference point

          if (error) {
            console.error('Error fetching predictions count:', error);
          }

          // Fallback to counting distinct users manually if the count query fails
          let entrantsCount = 0;
          
          if (userPredictions === null) {
            const { data: allPredictions } = await supabase
              .from("predictions")
              .select("user_id")
              .eq("question_id", 1);
              
            // Create a Set of unique user IDs
            const uniqueUsers = new Set(allPredictions?.map(p => p.user_id) || []);
            entrantsCount = uniqueUsers.size;
          } else {
            // Use the count from the query if available
            entrantsCount = userPredictions.length;
          }

          console.log(`Competition ${comp.id} has ${entrantsCount} entrants based on predictions`);

          return {
            ...comp,
            predictions_made: uniqueAnsweredQuestions.size,
            total_questions: 29,
            total_entrants: entrantsCount,
            predictions_sealed: isSubmitted,
            status
          };
        })
      );

      return enhancedCompetitions;
    },
    // Reduce stale time to refresh data more frequently
    staleTime: 10000,
  });

  return {
    firstName,
    competitions,
    isLoading
  };
};
