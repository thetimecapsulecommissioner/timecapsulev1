import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

export const usePredictionForm = (questions: any[]) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [showSealDialog, setShowSealDialog] = useState(false);
  const [comments, setComments] = useState<Record<number, string>>({});
  const { id: competitionId } = useParams();
  const queryClient = useQueryClient();

  // Get current user
  const { data: userData } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch existing predictions with proper error handling
  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ['predictions', competitionId, userData?.id],
    queryFn: async () => {
      if (!userData?.id || !competitionId) return null;

      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userData.id)
        .order('response_order');

      if (error) {
        console.error('Error fetching predictions:', error);
        toast.error("Failed to load your predictions");
        return null;
      }

      // Group predictions by question_id
      const groupedPredictions: Record<number, string[]> = {};
      data?.forEach(prediction => {
        if (!groupedPredictions[prediction.question_id]) {
          groupedPredictions[prediction.question_id] = [];
        }
        groupedPredictions[prediction.question_id][prediction.response_order - 1] = prediction.answer;
      });

      return groupedPredictions;
    },
    enabled: !!userData?.id && !!competitionId,
    staleTime: 1000, // Reduce unnecessary refetches
    retry: 2, // Retry failed requests
  });

  // Fetch existing comments
  const { data: savedComments } = useQuery({
    queryKey: ['prediction-comments', competitionId, userData?.id],
    queryFn: async () => {
      if (!userData?.id || !competitionId) return null;

      const { data, error } = await supabase
        .from('prediction_comments')
        .select('*')
        .eq('user_id', userData.id);

      if (error) {
        console.error('Error fetching comments:', error);
        return null;
      }

      const commentMap: Record<number, string> = {};
      data?.forEach(comment => {
        commentMap[comment.question_id] = comment.comment || '';
      });

      return commentMap;
    },
    enabled: !!userData?.id && !!competitionId,
  });

  // Initialize comments when savedComments are loaded
  useState(() => {
    if (savedComments) {
      setComments(savedComments);
    }
  }, [savedComments]);

  const handleSaveResponses = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      // Save comments
      for (const [questionId, comment] of Object.entries(comments)) {
        if (comment !== undefined) {
          const { error: commentError } = await supabase
            .from('prediction_comments')
            .upsert({
              user_id: user.id,
              question_id: parseInt(questionId),
              comment: comment
            }, {
              onConflict: 'user_id,question_id'
            });

          if (commentError) throw commentError;
        }
      }

      // Invalidate queries to refresh data
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      // Update predictions to submitted
      const { error: predictionError } = await supabase
        .from('predictions')
        .update({ submitted: true })
        .eq('user_id', user.id);

      if (predictionError) throw predictionError;

      // Update competition entry status
      const { error: entryError } = await supabase
        .from('competition_entries')
        .update({ status: 'Submitted' })
        .eq('user_id', user.id)
        .eq('competition_id', competitionId);

      if (entryError) throw entryError;

      setShowSealDialog(false);
      toast.success("Predictions sealed successfully!");

      // Invalidate queries to refresh data
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (responseOrder !== undefined) {
        // Save single answer
        const { error } = await supabase
          .from('predictions')
          .upsert({
            question_id: questionId,
            user_id: user.id,
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
              user_id: user.id,
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

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['competition-entry'] });
    } catch (error) {
      console.error('Error saving prediction:', error);
      toast.error("Failed to save prediction");
    }
  };

  const handleCommentChange = (questionId: number, comment: string) => {
    setComments(prev => ({
      ...prev,
      [questionId]: comment
    }));
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