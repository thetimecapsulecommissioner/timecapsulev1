import { useState } from "react";
import { usePredictions } from "@/hooks/usePredictions";
import { useComments } from "@/hooks/useComments";
import { useParams } from "react-router-dom";
import { usePredictionManagement } from "@/hooks/predictions/usePredictionManagement";
import { useCommentManagement } from "@/hooks/predictions/useCommentManagement";
import { toast } from "sonner";

export const usePredictionForm = (questions: any[]) => {
  const [showSealDialog, setShowSealDialog] = useState(false);
  const { id: competitionId } = useParams();
  
  const { predictions, predictionsLoading, userData } = usePredictions();
  const { comments, handleCommentChange } = useComments(userData?.id);
  
  const { 
    isSaving,
    isSealing,
    handleAnswerChange,
    handleSealPredictions,
    setIsSaving
  } = usePredictionManagement(userData?.id, competitionId);

  const { saveComment } = useCommentManagement(userData?.id);

  const handleSaveResponses = async () => {
    try {
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
    isSealing,
    showSealDialog,
    setShowSealDialog,
    handleSaveResponses,
    handleSealPredictions,
    handleAnswerChange,
    handleCommentChange,
  };
};