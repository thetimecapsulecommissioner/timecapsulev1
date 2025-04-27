
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";

export const useQuestionsTemplateUpload = () => {
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadTemplate = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          complete: resolve,
          error: reject,
        });
      });

      const data = (result as any).data;
      setPreviewData(data);

      // Validate required fields
      const requiredFields = [
        'competition_id', 'question_id', 'question_text',
        'response_category', 'points_value'
      ];

      const missingFields = requiredFields.filter(field => 
        !data[0]?.[field]
      );

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      // First verify that all referenced competition_ids exist
      const competitionIds = [...new Set(data.map((row: any) => row.competition_id))];
      
      const { data: existingCompetitions, error: lookupError } = await supabase
        .from('competitions_template')
        .select('competition_id')
        .in('competition_id', competitionIds);
        
      if (lookupError) {
        throw lookupError;
      }
      
      const existingIds = existingCompetitions.map(comp => comp.competition_id);
      const missingIds = competitionIds.filter(id => !existingIds.includes(id));
      
      if (missingIds.length > 0) {
        toast.error(`Competition IDs not found: ${missingIds.join(', ')}. Please upload competition template first.`);
        setIsLoading(false);
        return;
      }

      // Process special categories
      const processedData = data.map((row: any) => {
        const processed = {...row};
        
        if (row.response_category === 'Team') {
          processed.reference_table = 'teams';
        } else if (row.response_category === 'Player') {
          processed.reference_table = 'players';
        }
        
        return processed;
      });

      // Insert into Supabase
      const { error } = await supabase
        .from('questions_template')
        .insert(processedData);

      if (error) throw error;
      
      toast.success("Questions template uploaded successfully");
      setPreviewData(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload template");
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadTemplate, previewData, isLoading };
};
