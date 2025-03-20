
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";

// Define our competition status types - simplified to three states
export type CompetitionStatus = 
  | "Not Entered" 
  | "In Progress" 
  | "Closed";

export const useDashboardData = () => {
  const [firstName, setFirstName] = useState<string>("");
  const preSeasonDeadline = new Date('2025-03-06T23:59:00+11:00');
  const { timeLeft: preSeasonTime } = useCountdown(preSeasonDeadline);
  const isPreSeasonExpired = preSeasonTime.expired;

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

          // Direct approach: Get a count of distinct users who have made any predictions
          const { data: distinctUsersData, error: distinctUsersError } = await supabase
            .from("predictions")
            .select("user_id", { count: "exact" })
            .filter('user_id', 'not.is', null); // Ensure we only count valid users
            
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

          // Check the competition deadline and set isExpired flag
          // For competition with id 1, use the preSeasonDeadline
          // For all other competitions, we don't have deadlines yet
          let isExpired = false;
          if (comp.id === "1") {
            isExpired = isPreSeasonExpired;
          }

          // Simplified status determination based on new requirements
          let status: CompetitionStatus;
          const hasEntered = !!entry;

          if (isExpired) {
            // If expired, it's closed regardless of whether the user entered
            status = 'Closed';
          } else if (!hasEntered) {
            // Not expired and not entered
            status = 'Not Entered';
          } else {
            // Not expired and entered
            status = 'In Progress';
          }

          console.log(`Competition ${comp.id} status: ${status} (expired: ${isExpired}, entered: ${hasEntered})`);

          return {
            ...comp,
            predictions_made: uniqueAnsweredQuestions.size,
            total_questions: 29,
            total_entrants: entrantsCount,
            predictions_sealed: entry?.status === 'Submitted',
            status,
            isExpired
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
