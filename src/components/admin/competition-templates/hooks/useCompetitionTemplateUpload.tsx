
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";

// Define a type for our competition template data
interface CompetitionTemplateData {
  competition_id: string;
  competition_type: string;
  parent_competition_id?: string | null;
  competition_name: string;
  sport: string;
  competition_description?: string;
  open_date: string;
  close_date: string;
  event_date: string;
  entry_fee: string | number;
  prizes?: string;
}

// Define a type that matches the database schema
interface CompetitionTemplateDB {
  competition_id: string;
  competition_type: string;
  parent_competition_id?: string | null;
  competition_name: string;
  sport: string;
  competition_description?: string;
  open_date: string;
  close_date: string;
  event_date: string;
  entry_fee: number;  // Database expects a number
  prizes?: string;
}

export const useCompetitionTemplateUpload = () => {
  const [previewData, setPreviewData] = useState<CompetitionTemplateData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadTemplate = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await new Promise<Papa.ParseResult<CompetitionTemplateData>>((resolve, reject) => {
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
        !data[0]?.[field as keyof CompetitionTemplateData]
      );

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      // First, check if parent_competition_ids already exist
      const parentIds = data
        .map(row => row.parent_competition_id)
        .filter(id => id && id.trim() !== '') as string[];
      
      if (parentIds.length > 0) {
        const { data: existingParents, error: lookupError } = await supabase
          .from('competitions_template')
          .select('competition_id')
          .in('competition_id', parentIds);
          
        if (lookupError) {
          throw lookupError;
        }
        
        const existingIds = existingParents?.map(comp => comp.competition_id) || [];
        const missingParentIds = parentIds.filter(id => !existingIds.includes(id));
        
        if (missingParentIds.length > 0) {
          toast.error(`Parent competition IDs not found: ${missingParentIds.join(', ')}. Please upload parent competitions first.`);
          setIsLoading(false);
          return;
        }
      }

      // Process data to handle empty parent_competition_id correctly and convert entry_fee to number
      const processedData = data.map(row => {
        const processed = {...row} as CompetitionTemplateDB;
        
        // Set parent_competition_id to null if it's empty
        if (!processed.parent_competition_id || processed.parent_competition_id.trim() === '') {
          processed.parent_competition_id = null;
        }
        
        // Convert entry_fee to number
        processed.entry_fee = Number(processed.entry_fee);
        
        return processed;
      });

      // Insert into Supabase - using for...of loop for sequential processing to avoid foreign key errors
      for (const item of processedData) {
        const { error } = await supabase
          .from('competitions_template')
          .insert(item);

        if (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload template: ${error.message}`);
          setIsLoading(false);
          return;
        }
      }
      
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
