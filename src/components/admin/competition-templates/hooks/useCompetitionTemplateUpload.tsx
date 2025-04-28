
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";

interface CompetitionTemplate {
  competition_id: string;
  competition_type: string;
  competition_name: string;
  sport: string;
  open_date: string;
  close_date: string;
  event_date: string;
  entry_fee: number;
  parent_competition_id?: string;
  max_participants?: number;
  prizes?: string;
  competition_description?: string;
}

export const useCompetitionTemplateUpload = () => {
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateTemplate = (data: CompetitionTemplate[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const requiredFields = [
      'competition_id', 'competition_type', 'competition_name',
      'sport', 'open_date', 'close_date', 'event_date', 'entry_fee'
    ];

    // Validate required fields exist
    const missingFields = requiredFields.filter(field => 
      !data[0]?.[field as keyof CompetitionTemplate]
    );

    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate parent competition IDs if present
    const itemsWithParent = data.filter(item => item.parent_competition_id && item.parent_competition_id.trim() !== '');
    if (itemsWithParent.length > 0) {
      // Check if parent competitions exist
      const parentIds = Array.from(new Set(itemsWithParent.map(item => item.parent_competition_id)));
      
      // We'll validate these against the database in the uploadTemplate function
      console.log(`Templates with parent competitions: ${parentIds.join(', ')}`);
    }

    return { 
      isValid: errors.length === 0, 
      errors 
    };
  };

  const uploadTemplate = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await new Promise<Papa.ParseResult<CompetitionTemplate>>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          complete: resolve,
          error: reject,
        });
      });

      const data = result.data as CompetitionTemplate[];
      setPreviewData(data);
      
      // Validate template data
      const validation = validateTemplate(data);
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        return;
      }

      // Check if parent competitions exist in the database
      const itemsWithParent = data.filter(item => item.parent_competition_id && item.parent_competition_id.trim() !== '');
      if (itemsWithParent.length > 0) {
        const parentIds = Array.from(new Set(itemsWithParent.map(item => item.parent_competition_id)));
        
        const { data: existingParents, error: parentsLookupError } = await supabase
          .from('competitions_template')
          .select('competition_id')
          .in('competition_id', parentIds);

        if (parentsLookupError) {
          console.error('Error checking parent competitions:', parentsLookupError);
          toast.error("Error checking parent competitions");
          return;
        }

        const existingParentIds = existingParents?.map(p => p.competition_id) || [];
        const missingParents = parentIds.filter(id => !existingParentIds.includes(id));
        
        if (missingParents.length > 0) {
          toast.error(`Missing parent competitions: ${missingParents.join(', ')}. Please ensure parent competitions exist before uploading child competitions.`);
          return;
        }
      }

      // Insert into Supabase
      const { error } = await supabase
        .from('competitions_template')
        .insert(data);

      if (error) {
        console.error('Template upload error:', error);
        
        if (error.message.includes('foreign key constraint')) {
          toast.error("Failed to upload template: Parent competition ID doesn't exist");
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
        return;
      }
      
      // Create actual competitions from the template
      for (const template of data) {
        const competitionData = {
          id: template.competition_id,
          label: template.competition_name,
          total_questions: 0,  // Will be updated when questions are uploaded
          status: 'Not Started'
        };
        
        const { error: competitionError } = await supabase
          .from('competitions')
          .insert(competitionData);
          
        if (competitionError) {
          console.error('Error creating competition from template:', competitionError);
          
          // If it's a duplicate key error, it might just mean the competition already exists
          if (!competitionError.message.includes('duplicate key')) {
            toast.error(`Failed to create competition: ${competitionError.message}`);
          } else {
            console.log(`Competition ${template.competition_id} already exists, skipping creation`);
          }
        }
      }
      
      toast.success("Competition template uploaded and competitions created successfully");
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
