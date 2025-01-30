import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const useCompetitionData = () => {
  const { id: competitionId } = useParams();
  const [hasEntered, setHasEntered] = useState(false);
  const queryClient = useQueryClient();

  // Get current user
  const { data: userData } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch questions
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id');
      if (error) throw error;
      return data;
    },
    enabled: !!userData?.id,
    staleTime: 5 * 60 * 1000,
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

      if (entryError) throw entryError;

      const { count, error: countError } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userData.id);

      if (countError) throw countError;

      return {
        ...entryData,
        predictions_count: count || 0
      };
    },
    enabled: !!userData?.id && !!competitionId,
    staleTime: 0,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (entry?.terms_accepted) {
      setHasEntered(true);
    }
  }, [entry]);

  // Update competition entry with prediction count
  useEffect(() => {
    const updatePredictionCount = async () => {
      if (entry?.predictions_count !== undefined && competitionId && userData?.id) {
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