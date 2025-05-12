
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GroupedPredictions } from "@/types/predictions";
import { useParams } from "react-router-dom";

export const usePredictions = () => {
  const { id: competitionId } = useParams();
  
  const { data: userData } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ['predictions', competitionId, userData?.id],
    queryFn: async () => {
      if (!userData?.id || !competitionId) return null;

      // First check if entry is sealed
      const { data: entryData } = await supabase
        .from('competition_entries')
        .select('status')
        .eq('user_id', userData.id)
        .eq('competition_id', competitionId)
        .maybeSingle();

      // Get predictions
      const { data, error } = await supabase
        .from('legacy_predictions')
        .select('*')
        .eq('user_id', userData.id)
        .order('response_order');

      if (error) {
        console.error('Error fetching predictions:', error);
        toast.error("Failed to load your predictions");
        return null;
      }

      const groupedPredictions: GroupedPredictions = {};
      data?.forEach(prediction => {
        if (!groupedPredictions[prediction.question_id]) {
          groupedPredictions[prediction.question_id] = [];
        }
        groupedPredictions[prediction.question_id][prediction.response_order - 1] = prediction.answer;
      });

      const isSubmitted = entryData?.status === 'Submitted';

      return { predictions: groupedPredictions, isSubmitted };
    },
    enabled: !!userData?.id && !!competitionId,
    staleTime: 1000,
    retry: 2,
  });

  return {
    predictions: predictions?.predictions || {},
    predictionsLoading,
    userData,
    isSubmitted: predictions?.isSubmitted || false
  };
};
