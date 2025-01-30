import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PredictionComments } from "@/types/predictions";
import { useParams } from "react-router-dom";

export const useComments = (userId: string | undefined) => {
  const { id: competitionId } = useParams();
  const [comments, setComments] = useState<PredictionComments>({});

  const { data: savedComments } = useQuery({
    queryKey: ['prediction-comments', competitionId, userId],
    queryFn: async () => {
      if (!userId || !competitionId) return null;

      const { data, error } = await supabase
        .from('prediction_comments')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching comments:', error);
        return null;
      }

      const commentMap: PredictionComments = {};
      data?.forEach(comment => {
        commentMap[comment.question_id] = comment.comment || '';
      });

      return commentMap;
    },
    enabled: !!userId && !!competitionId,
  });

  useEffect(() => {
    if (savedComments) {
      setComments(savedComments);
    }
  }, [savedComments]);

  const handleCommentChange = (questionId: number, comment: string) => {
    setComments(prev => ({
      ...prev,
      [questionId]: comment
    }));
  };

  return {
    comments,
    handleCommentChange
  };
};