import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileDropdown } from "./ProfileDropdown";
import { useNavigate, useParams } from "react-router-dom";

export const Questions = () => {
  const navigate = useNavigate();
  const { id: competitionId } = useParams();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Fetch competition details
  const { data: competition } = useQuery({
    queryKey: ['competition', competitionId],
    queryFn: async () => {
      if (!competitionId) return null;
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', competitionId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!competitionId,
  });

  // Fetch questions from Supabase
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id');
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's existing predictions
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

  // Load existing predictions into state
  useEffect(() => {
    if (predictions) {
      const existingAnswers: Record<number, string> = {};
      predictions.forEach((prediction) => {
        existingAnswers[prediction.question_id] = prediction.answer;
      });
      setAnswers(existingAnswers);
    }
  }, [predictions]);

  // Save prediction mutation
  const savePrediction = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: number; answer: string }) => {
      const { data, error } = await supabase
        .from('predictions')
        .upsert({
          question_id: questionId,
          answer,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }, {
          onConflict: 'user_id,question_id'
        });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });

  const handleAnswerChange = async (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    try {
      await savePrediction.mutateAsync({ questionId, answer: value });
      toast.success("Prediction saved!");
    } catch (error) {
      toast.error("Failed to save prediction");
    }
  };

  const handleSubmit = async () => {
    if (!questions || Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions");
      return;
    }

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

  if (questionsLoading || predictionsLoading) {
    return <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-secondary">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="fixed top-4 right-4 z-50">
        <ProfileDropdown />
      </div>
      
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-12 px-4">
        <h2 className="text-3xl font-bold text-secondary text-center mb-8">
          {competition?.label || 'Make Your Predictions'}
        </h2>
        
        {questions?.map((q) => (
          <Card key={q.id} className="p-6 bg-mystical-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{q.question}</h3>
            <RadioGroup
              onValueChange={(value) => handleAnswerChange(q.id, value)}
              value={answers[q.id]}
            >
              <div className="space-y-3">
                {q.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                    <Label htmlFor={`${q.id}-${option}`} className="text-gray-700">{option}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>
        ))}

        <Button
          onClick={handleSubmit}
          className="w-full bg-secondary hover:bg-secondary-light text-primary py-6 text-lg rounded-lg transition-all duration-300"
        >
          Seal Your Predictions
        </Button>
      </div>
    </div>
  );
};