
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";

export const useCompetitionTemplateUpload = () => {
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadTemplate = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          complete: resolve,
          error: reject,
        });
      });

      const data = result.data;
      setPreviewData(data);

      // Validate required fields
      const requiredFields = [
        'competition_id', 'competition_type', 'competition_name',
        'sport', 'open_date', 'close_date', 'event_date', 'entry_fee'
      ];

      const missingFields = requiredFields.filter(field => 
        !data[0]?.[field]
      );

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Insert into Supabase
      const { error } = await supabase
        .from('competitions_template')
        .insert(data);

      if (error) throw error;
      
      toast.success("Competition template uploaded successfully");
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
