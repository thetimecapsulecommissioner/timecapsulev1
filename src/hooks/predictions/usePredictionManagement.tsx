
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePredictionManagement = (userId: string | undefined, competitionId: string | undefined) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleAnswerChange = async (questionId: number, answers: string[], responseOrder?: number) => {
    if (!userId || !competitionId) return;

    try {
      setIsSaving(true);
      
      // Handle multiple answers (like when there are multiple required responses)
      if (Array.isArray(answers) && answers.length > 0) {
        for (let i = 0; i < answers.length; i++) {
          const order = responseOrder !== undefined ? responseOrder : i + 1;
          const answer = answers[i];
          
          // Check if a prediction already exists
          const { data: existingPrediction } = await supabase
            .from('legacy_predictions')
            .select('*')
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .eq('response_order', order)
            .maybeSingle();
          
          if (existingPrediction) {
            // Update existing prediction
            await supabase
              .from('legacy_predictions')
              .update({ answer })
              .eq('id', existingPrediction.id);
          } else {
            // Create new prediction
            await supabase
              .from('legacy_predictions')
              .insert({
                user_id: userId,
                question_id: questionId,
                answer,
                response_order: order
              });
          }
        }
      }
      
      console.log(`Answer saved for question ${questionId}`);
    } catch (error) {
      console.error('Error saving prediction:', error);
      toast.error('Failed to save your prediction');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleAnswerChange,
    isSaving,
    setIsSaving
  };
};
