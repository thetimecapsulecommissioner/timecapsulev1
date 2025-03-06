
import { useState } from "react";
import { usePredictions } from "@/hooks/usePredictions";
import { useComments } from "@/hooks/useComments";
import { useParams } from "react-router-dom";
import { usePredictionManagement } from "@/hooks/predictions/usePredictionManagement";
import { useCommentManagement } from "@/hooks/predictions/useCommentManagement";
import { toast } from "sonner";

export const usePredictionForm = (questions: any[]) => {
  const { id: competitionId } = useParams();
  
  const { predictions, predictionsLoading, userData, isSubmitted } = usePredictions();
  const { comments, handleCommentChange } = useComments(userData?.id);
  
  const { 
    isSaving,
    handleAnswerChange,
    setIsSaving
  } = usePredictionManagement(userData?.id, competitionId);

  const { saveComment } = useCommentManagement(userData?.id);

  const handleSaveResponses = async () => {
    try {
      // Check if the deadline has passed
      const preSeasonDeadline = new Date('2025-03-06T23:59:00+11:00');
      const now = new Date();
      
      if (now > preSeasonDeadline) {
        toast.error("The deadline has passed. Predictions are now locked.");
        return;
      }
      
      setIsSaving(true);
      if (!userData?.id || !competitionId) return;

      // Save comments
      const commentPromises = Object.entries(comments).map(([questionId, comment]) => 
        saveComment(parseInt(questionId), comment)
      );

      await Promise.all(commentPromises);
      toast.success("Responses and comments saved successfully!");
    } catch (error) {
      console.error('Error saving responses:', error);
      toast.error("Failed to save responses");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    predictions,
    predictionsLoading,
    comments,
    isSaving,
    handleSaveResponses,
    handleAnswerChange,
    handleCommentChange,
    isSubmitted
  };
};
