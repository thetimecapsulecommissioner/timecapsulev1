
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

export const usePredictionManagement = (userId?: string, competitionId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const queryClient = useQueryClient();

  const handleAnswerChange = async (questionId: number, answers: string[], responseOrder?: number) => {
    try {
      if (!userId) return;

      if (responseOrder !== undefined) {
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

        // Insert new predictions
        const upsertPromises: Promise<{ error: PostgrestError | null }>[] = answers.map((answer, index) => 
          supabase
            .from('predictions')
            .upsert({
              question_id: questionId,
              user_id: userId,
              answer,
              response_order: index + 1
            })
        );

        const results = await Promise.all(upsertPromises);
        const errors = results.filter(result => result.error);
        if (errors.length > 0) throw errors[0].error;
      }

      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['competition-entry'] });
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

      toast.success("Predictions sealed successfully!");
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['competition-entry'] });
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
