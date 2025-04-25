
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

      // Validate special categories
      for (const row of data) {
        if (row.response_category === 'Team') {
          row.reference_table = 'teams';
        } else if (row.response_category === 'Player') {
          row.reference_table = 'players';
        }
      }

      // Insert into Supabase
      const { error } = await supabase
        .from('questions_template')
        .insert(data);

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
