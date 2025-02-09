
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Prediction } from "@/types/predictions";

export const usePredictionManagement = (userId?: string, competitionId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const queryClient = useQueryClient();

  const handleAnswerChange = async (questionId: number, answers: string[], responseOrder?: number) => {
    try {
      if (!userId) return;

      // Case 1: Single prediction update
      if (responseOrder !== undefined) {
        const { error } = await supabase
          .from('predictions')
          .upsert({
            question_id: questionId,
            user_id: userId,
            answer: answers[responseOrder - 1],
            response_order: responseOrder
          });

        if (error) throw error;
        
      // Case 2: Multiple predictions update
      } else {
        // First delete existing predictions
        const { error: deleteError } = await supabase
          .from('predictions')
          .delete()
          .eq('user_id', userId)
          .eq('question_id', questionId);

        if (deleteError) throw deleteError;

        // Then insert new predictions
        for (const [index, answer] of answers.entries()) {
          const { error: insertError } = await supabase
            .from('predictions')
            .insert({
              question_id: questionId,
              user_id: userId,
              answer,
              response_order: index + 1
            });

          if (insertError) throw insertError;
        }
      }

      const invalidatePromises: Promise<void>[] = [
        queryClient.invalidateQueries({ queryKey: ['predictions'] }).then(() => {}),
        queryClient.invalidateQueries({ queryKey: ['competition-entry'] }).then(() => {})
      ];
      
      await Promise.all(invalidatePromises);
      
    } catch (error) {
      console.error('Error saving prediction:', error);
      toast.error("Failed to save prediction");
    }
  };

  const handleSealPredictions = async () => {
    try {
      setIsSealing(true);
      if (!userId || !competitionId) return;

      const { data: questions } = await supabase
        .from('questions')
        .select('id')
        .eq('competition_id', competitionId);

      const { data: predictions } = await supabase
        .from('predictions')
        .select('question_id')
        .eq('user_id', userId);

      const answeredQuestionIds = new Set(predictions?.map(p => p.question_id));
      const allQuestionsAnswered = questions?.every(q => answeredQuestionIds.has(q.id));

      if (!allQuestionsAnswered) {
        toast.error("Please answer all questions before sealing your predictions");
        return;
      }

      const { error: predictionError } = await supabase
        .from('predictions')
        .update({ submitted: true })
        .eq('user_id', userId);

      if (predictionError) throw predictionError;

      const { error: entryError } = await supabase
        .from('competition_entries')
        .update({ status: 'Submitted' })
        .eq('user_id', userId)
        .eq('competition_id', competitionId);

      if (entryError) throw entryError;

      const invalidatePromises: Promise<void>[] = [
        queryClient.invalidateQueries({ queryKey: ['predictions'] }).then(() => {}),
        queryClient.invalidateQueries({ queryKey: ['competition-entry'] }).then(() => {})
      ];
      
      await Promise.all(invalidatePromises);

      toast.success("Predictions sealed successfully!");
    } catch (error) {
      console.error('Error sealing predictions:', error);
      toast.error("Failed to seal predictions");
    } finally {
      setIsSealing(false);
    }
  };

  return {
    isSaving,
    isSealing,
    handleAnswerChange,
    handleSealPredictions,
    setIsSaving
  };
};
