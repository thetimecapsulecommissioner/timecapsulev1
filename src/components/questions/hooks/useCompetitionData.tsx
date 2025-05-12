
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useCompetitionData = () => {
  const { id: competitionId } = useParams();
  const [hasEntered, setHasEntered] = useState(false);
  const queryClient = useQueryClient();

  // Get current user
  const { data: userData, isError: userError } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        toast.error("Authentication error. Please try logging in again.");
        throw error;
      }
      return user;
    },
    retry: 1,
  });

  // Fetch questions
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legacy_questions')
        .select('*')
        .order('id');
      if (error) {
        toast.error("Failed to load questions");
        throw error;
      }
      return data;
    },
    enabled: !!userData?.id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Check competition entry
  const { data: entry, isLoading: entryLoading } = useQuery({
    queryKey: ['competition-entry', competitionId, userData?.id],
    queryFn: async () => {
      if (!userData?.id || !competitionId) return null;

      const { data: entryData, error: entryError } = await supabase
        .from('competition_entries')
        .select('*')
        .eq('user_id', userData.id)
        .eq('competition_id', competitionId)
        .maybeSingle();

      if (entryError) {
        toast.error("Failed to load competition entry");
        throw entryError;
      }

      const { count, error: countError } = await supabase
        .from('legacy_predictions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userData.id);

      if (countError) {
        toast.error("Failed to load predictions count");
        throw countError;
      }

      return {
        ...entryData,
        predictions_count: count || 0
      };
    },
    enabled: !!userData?.id && !!competitionId,
    staleTime: 0,
    refetchInterval: 5000,
    retry: 2,
  });

  useEffect(() => {
    if (entry?.terms_accepted && entry?.payment_completed) {
      setHasEntered(true);
    } else {
      setHasEntered(false);
    }
  }, [entry]);

  // Update competition entry with prediction count
  useEffect(() => {
    const updatePredictionCount = async () => {
      if (entry?.predictions_count !== undefined && competitionId && userData?.id) {
        try {
          await supabase
            .from('competition_entries')
            .update({ responses_saved: entry.predictions_count })
            .eq('user_id', userData.id)
            .eq('competition_id', competitionId);

          queryClient.invalidateQueries({ 
            queryKey: ['competition-entry', competitionId, userData.id],
            exact: true 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['predictions', competitionId, userData.id],
            exact: true 
          });
        } catch (error) {
          console.error('Error updating prediction count:', error);
          toast.error("Failed to update prediction count");
        }
      }
    };

    updatePredictionCount();
  }, [entry?.predictions_count, competitionId, userData?.id, queryClient]);

  return {
    userData,
    questions,
    questionsLoading,
    entry,
    entryLoading,
    hasEntered,
    setHasEntered
  };
};
