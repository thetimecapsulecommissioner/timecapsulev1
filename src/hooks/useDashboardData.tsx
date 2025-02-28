
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

          // Direct approach: Get a count of distinct users who have made any predictions
          const { data: distinctUsersData, error: distinctUsersError } = await supabase
            .from("predictions")
            .select("user_id", { count: "exact" })
            .is("user_id", 'not.null'); // Ensure we only count valid users
            
          if (distinctUsersError) {
            console.error('Error fetching distinct users count:', distinctUsersError);
          }
          
          let entrantsCount = 0;
          
          if (distinctUsersData !== null) {
            // Get all distinct user IDs
            const { data: allUserIds } = await supabase
              .from("predictions")
              .select("user_id");
              
            // Create a Set to count unique user IDs
            const uniqueUserIds = new Set();
            allUserIds?.forEach(p => {
              if (p.user_id) {
                uniqueUserIds.add(p.user_id);
              }
            });
            
            entrantsCount = uniqueUserIds.size;
            console.log(`Counted ${entrantsCount} unique users from predictions`);
          }

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
    // Refresh data frequently to ensure we have up-to-date counts
    staleTime: 5000,
  });

  return {
    firstName,
    competitions,
    isLoading
  };
};
