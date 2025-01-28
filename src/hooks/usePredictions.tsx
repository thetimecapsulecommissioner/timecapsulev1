import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePredictions = () => {
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const queryClient = useQueryClient();

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('response_order');
      if (error) throw error;
      
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
  });

  const savePrediction = useMutation({
    mutationFn: async ({ questionId, answers, responseOrder }: { questionId: number; answers: string[]; responseOrder?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');

      // If saving a single answer at a specific order
      if (responseOrder !== undefined) {
        const { data, error } = await supabase
          .from('predictions')
          .upsert({
            question_id: questionId,
            answer: answers[responseOrder - 1],
            user_id: user.id,
            response_order: responseOrder
          })
          .select();
        
        if (error) throw error;
        return data;
      }
      
      // If saving multiple answers
      const promises = answers.map((answer, index) => 
        supabase
          .from('predictions')
          .upsert({
            question_id: questionId,
            answer,
            user_id: user.id,
            response_order: index + 1
          })
          .select()
      );

      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);
      if (errors.length > 0) throw errors[0].error;
      
      return results.map(result => result.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });

  const handleAnswerChange = async (questionId: number, value: string[], responseOrder?: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    try {
      await savePrediction.mutateAsync({ questionId, answers: value, responseOrder });
      toast.success("Prediction saved!");
    } catch (error) {
      toast.error("Failed to save prediction");
    }
  };

  const handleSubmit = async (questions: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('predictions')
        .update({ submitted: true })
        .eq('user_id', user.id)
        .in('question_id', questions.map(q => q.id));

      if (error) throw error;
      toast.success("Predictions submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit predictions");
    }
  };

  return {
    answers,
    setAnswers,
    predictions,
    predictionsLoading,
    handleAnswerChange,
    handleSubmit,
  };
};