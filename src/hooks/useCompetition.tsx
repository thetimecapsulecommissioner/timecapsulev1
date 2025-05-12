
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCompetition = (competitionId: string | undefined) => {
  return useQuery({
    queryKey: ['competition', competitionId],
    queryFn: async () => {
      if (!competitionId) return null;
      
      const { data, error } = await supabase
        .from('legacy_competitions')
        .select('*')
        .eq('id', competitionId)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    enabled: !!competitionId,
    refetchOnWindowFocus: false,
  });
};
