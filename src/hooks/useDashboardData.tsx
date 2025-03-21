
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";

// Define our competition status types - simplified to three states
export type CompetitionStatus = 
  | "Not Entered" 
  | "In Progress" 
  | "Closed";

// Central function to determine competition status
export const determineCompetitionStatus = (
  isExpired: boolean,
  hasEntered: boolean
): CompetitionStatus => {
  if (isExpired) {
    return 'Closed';
  } else if (!hasEntered) {
    return 'Not Entered';
  } else {
    return 'In Progress';
  }
};

export const useDashboardData = () => {
  const [firstName, setFirstName] = useState<string>("");
  const preSeasonDeadline = new Date('2023-09-06T23:59:00+11:00'); // Setting to past date to test expiration
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
          // Get competition entry status and predictions for the current user
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

          // Count users who have made at least one prediction as entrants
          // This query gets distinct user_ids from the predictions table related to this competition
          const { data: uniqueUsers, error: uniqueUsersError } = await supabase
            .from("predictions")
            .select('user_id', { count: 'exact', head: false })
            .not('question_id', 'is', null)
            .limit(1000); // Add a reasonable limit
            
          // Create a set of unique user IDs from the predictions
          const uniqueEntrants = new Set(uniqueUsers?.map(p => p.user_id));
          const entrantsCount = uniqueEntrants.size;
            
          console.log('Unique users query result:', { 
            uniqueUsers,
            uniqueUsersError,
            uniqueEntrantsSet: uniqueEntrants,
            entrantsCount
          });
          
          console.log(`Competition ${comp.id} total prediction users: ${entrantsCount || 0}`);
          
          // Check the competition deadline and set isExpired flag
          // For all competitions, use the preSeasonDeadline
          // This ensures consistent expiration status across the app
          let isExpired = isPreSeasonExpired;

          // Use the central function to determine status
          const hasEntered = !!entry;
          const status = determineCompetitionStatus(isExpired, hasEntered);

          console.log(`Competition ${comp.id} status: ${status} (expired: ${isExpired}, entered: ${hasEntered})`);

          return {
            ...comp,
            predictions_made: uniqueAnsweredQuestions.size,
            total_questions: 29,
            total_entrants: entrantsCount || 0,
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
    isLoading,
    isPreSeasonExpired // Export this so other components can use the same expiration status
  };
};
