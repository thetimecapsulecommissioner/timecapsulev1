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
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const savePrediction = useMutation({
    mutationFn: async ({ questionId, answers }: { questionId: number; answers: string[] }) => {
      // Delete existing predictions for this question
      await supabase
        .from('predictions')
        .delete()
        .eq('question_id', questionId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      // Insert new predictions
      const { data, error } = await supabase
        .from('predictions')
        .insert(
          answers.map(answer => ({
            question_id: questionId,
            answer,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          }))
        );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });

  const handleAnswerChange = async (questionId: number, value: string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    try {
      await savePrediction.mutateAsync({ questionId, answers: value });
      toast.success("Prediction saved!");
    } catch (error) {
      toast.error("Failed to save prediction");
    }
  };

  const handleSubmit = async (questions: any[]) => {
    try {
      const { error } = await supabase
        .from('predictions')
        .update({ submitted: true })
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