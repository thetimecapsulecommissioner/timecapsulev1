import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePredictions } from "@/hooks/usePredictions";
import { useComments } from "@/hooks/useComments";
import { useParams } from "react-router-dom";

export const usePredictionForm = (questions: any[]) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [showSealDialog, setShowSealDialog] = useState(false);
  const queryClient = useQueryClient();
  const { id: competitionId } = useParams();
  
  const { predictions, predictionsLoading, userData } = usePredictions();
  const { comments, handleCommentChange } = useComments(userData?.id);

  const handleSaveResponses = async () => {
    try {
      setIsSaving(true);
      if (!userData?.id || !competitionId) return;

      // Save comments
      for (const [questionId, comment] of Object.entries(comments)) {
        if (comment !== undefined) {
          const { error: commentError } = await supabase
            .from('prediction_comments')
            .upsert({
              user_id: userData.id,
              question_id: parseInt(questionId),
              comment: comment
            }, {
              onConflict: 'user_id,question_id'
            });

          if (commentError) throw commentError;
        }
      }

      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['prediction-comments'] });
      queryClient.invalidateQueries({ queryKey: ['competition-entry'] });

      toast.success("Responses and comments saved successfully!");
    } catch (error) {
      console.error('Error saving responses:', error);
      toast.error("Failed to save responses");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSealPredictions = async () => {
    try {
      setIsSealing(true);
      if (!userData?.id || !competitionId) return;

      const { error: predictionError } = await supabase
        .from('predictions')
        .update({ submitted: true })
        .eq('user_id', userData.id);

      if (predictionError) throw predictionError;

      const { error: entryError } = await supabase
        .from('competition_entries')
        .update({ status: 'Submitted' })
        .eq('user_id', userData.id)
        .eq('competition_id', competitionId);

      if (entryError) throw entryError;

      setShowSealDialog(false);
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

  const handleAnswerChange = async (questionId: number, answers: string[], responseOrder?: number) => {
    try {
      if (!userData?.id) return;

      if (responseOrder !== undefined) {
        // Save single answer
        const { error } = await supabase
          .from('predictions')
          .upsert({
            question_id: questionId,
            user_id: userData.id,
            answer: answers[responseOrder - 1],
            response_order: responseOrder
          }, {
            onConflict: 'user_id,question_id,response_order'
          });

        if (error) throw error;
      } else {
        // Save multiple answers
        const upsertPromises = answers.map((answer, index) => 
          supabase
            .from('predictions')
            .upsert({
              question_id: questionId,
              user_id: userData.id,
              answer,
              response_order: index + 1
            }, {
              onConflict: 'user_id,question_id,response_order'
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

  return {
    predictions,
    predictionsLoading,
    comments,
    isSaving,
    isSealing,
    showSealDialog,
    setShowSealDialog,
    handleSaveResponses,
    handleSealPredictions,
    handleAnswerChange,
    handleCommentChange,
  };
};