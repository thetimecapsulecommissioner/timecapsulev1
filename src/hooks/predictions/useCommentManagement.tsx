
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useCommentManagement = (userId: string | undefined) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { id: competitionId } = useParams();

  const saveComment = async (questionId: number, comment: string) => {
    if (!userId || !competitionId) return;
    
    try {
      setIsProcessing(true);
      
      const { data: existingComment, error: fetchError } = await supabase
        .from('prediction_comments')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // Not found error
        console.error('Error checking for existing comment:', fetchError);
        throw fetchError;
      }
      
      // If comment exists, update it. Otherwise insert a new one.
      if (existingComment) {
        const { error: updateError } = await supabase
          .from('prediction_comments')
          .update({ 
            comment: comment,
            competition_id: competitionId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingComment.id);
        
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('prediction_comments')
          .insert({ 
            user_id: userId,
            question_id: questionId,
            comment: comment,
            competition_id: competitionId
          });
        
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving comment:', error);
      toast.error("Failed to save your comment");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return { saveComment, isProcessing };
};
