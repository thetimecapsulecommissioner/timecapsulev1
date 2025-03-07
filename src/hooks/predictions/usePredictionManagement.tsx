
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePredictionManagement = (userId?: string, competitionId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleAnswerChange = async (questionId: number, answers: string[], responseOrder?: number) => {
    try {
      if (!userId) return;
      
      // Set deadline to 30 minutes from now
      const now = new Date();
      const deadline = new Date(now.getTime() + 30 * 60000); // 30 minutes in milliseconds
      
      if (now > deadline) {
        toast.error("The deadline has passed. Predictions are now locked.");
        return;
      }

      if (responseOrder !== undefined) {
        // Update single prediction with conflict handling
        const { error } = await supabase
          .from('predictions')
          .upsert({
            question_id: questionId,
            user_id: userId,
            answer: answers[responseOrder - 1],
            response_order: responseOrder
          }, {
            onConflict: 'user_id,question_id,response_order'
          });

        if (error) throw error;
      } else {
        // Delete existing predictions for this question
        await supabase
          .from('predictions')
          .delete()
          .eq('user_id', userId)
          .eq('question_id', questionId);

        // Create new predictions with proper conflict handling
        const predictions = answers.map((answer, index) => ({
          question_id: questionId,
          user_id: userId,
          answer,
          response_order: index + 1
        }));

        const { error } = await supabase
          .from('predictions')
          .upsert(predictions, {
            onConflict: 'user_id,question_id,response_order'
          });

        if (error) throw error;
      }

      // Check if all questions are answered and update status
      const { count } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (count === 29) { // Total number of questions
        await supabase
          .from('competition_entries')
          .update({ status: 'Complete' })
          .eq('user_id', userId)
          .eq('competition_id', competitionId);
      } else {
        await supabase
          .from('competition_entries')
          .update({ status: 'In Progress' })
          .eq('user_id', userId)
          .eq('competition_id', competitionId);
      }

      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['competition-entry'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-competitions'] });
    } catch (error) {
      console.error('Error saving prediction:', error);
      toast.error("Failed to save prediction");
    }
  };

  return {
    isSaving,
    handleAnswerChange,
    setIsSaving
  };
};
