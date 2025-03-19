
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Competition {
  id: string;
  label: string;
  total_questions: number;
  status: string;
  summary?: string;
  instructions?: string;
  prize_details?: string;
}

export const useCompetition = (competitionId: string | undefined) => {
  return useQuery({
    queryKey: ['competition', competitionId],
    queryFn: async () => {
      if (!competitionId) return null;
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', competitionId)
        .single();
      if (error) throw error;
      return data as Competition;
    },
    enabled: !!competitionId,
  });
};
