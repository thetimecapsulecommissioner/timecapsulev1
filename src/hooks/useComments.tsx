
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { PredictionComments } from '@/types/predictions';
import { toast } from 'sonner';

export const useComments = (userId: string | undefined) => {
  const [comments, setComments] = useState<PredictionComments>({});
  const { id: competitionId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      if (!userId || !competitionId) return;
      
      const { data, error } = await supabase
        .from('prediction_comments')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching comments:', error);
        toast.error("Failed to load your comments");
        return;
      }
      
      const loadedComments: PredictionComments = {};
      data.forEach(comment => {
        loadedComments[comment.question_id] = comment.comment || '';
      });
      
      setComments(loadedComments);
    };
    
    fetchComments();
  }, [userId, competitionId]);
  
  const handleCommentChange = (questionId: number, comment: string) => {
    setComments(prevComments => ({
      ...prevComments,
      [questionId]: comment
    }));
  };
  
  return { comments, handleCommentChange };
};
