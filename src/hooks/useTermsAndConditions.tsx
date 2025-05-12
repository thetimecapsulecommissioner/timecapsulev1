
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TermsAndConditions {
  "Rule Reference": number;
  Category: string;
  Name: string;
  Description: string;
}

export const useTermsAndConditions = () => {
  return useQuery({
    queryKey: ['terms-and-conditions'],
    queryFn: async () => {
      console.log('Fetching terms and conditions...');
      const { data, error } = await supabase
        .from('legacy_terms_and_conditions_2025')
        .select('*')
        .order('"Rule Reference"');
      
      if (error) {
        console.error('Error fetching terms and conditions:', error);
        throw error;
      }
      
      console.log('Terms and conditions data:', data);
      return data as TermsAndConditions[];
    },
  });
};
