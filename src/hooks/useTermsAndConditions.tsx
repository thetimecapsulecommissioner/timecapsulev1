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
      const { data, error } = await supabase
        .from('Terms and Conditions 2025 AFL Time Capsule')
        .select('*')
        .order('"Rule Reference"');
      
      if (error) {
        console.error('Error fetching terms and conditions:', error);
        throw error;
      }
      
      return data as TermsAndConditions[];
    },
  });
};