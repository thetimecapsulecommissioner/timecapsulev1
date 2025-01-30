import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface PredictionFormProps {
  questions: any[];
  answeredQuestions: number;
}

export const PredictionForm = ({ questions, answeredQuestions }: PredictionFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { id: competitionId } = useParams();

  const handleSaveResponses = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      // First check if entry exists
      const { data: entries, error: fetchError } = await supabase
        .from('competition_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('competition_id', competitionId);

      if (fetchError) throw fetchError;

      if (!entries || entries.length === 0) {
        // Create new entry if it doesn't exist
        const { error: insertError } = await supabase
          .from('competition_entries')
          .insert({
            competition_id: competitionId,
            user_id: user.id,
            responses_saved: answeredQuestions
          });

        if (insertError) throw insertError;
      } else {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('competition_entries')
          .update({ responses_saved: answeredQuestions })
          .eq('user_id', user.id)
          .eq('competition_id', competitionId);

        if (updateError) throw updateError;
      }

      toast.success("Responses saved successfully!");
    } catch (error) {
      console.error('Error saving responses:', error);
      toast.error("Failed to save responses");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <Button 
        onClick={handleSaveResponses}
        disabled={isSaving}
        className="w-full max-w-md"
      >
        {isSaving ? "Saving..." : "Save Responses"}
      </Button>
    </div>
  );
};