import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./QuestionCard";
import { usePredictions } from "@/hooks/usePredictions";

interface PredictionFormProps {
  competitionLabel?: string;
}

export const PredictionForm = ({ competitionLabel }: PredictionFormProps) => {
  const { answers, handleAnswerChange, handleSubmit } = usePredictions();

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

  if (questionsLoading) {
    return <div className="text-secondary">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-12 px-4">
      <h2 className="text-3xl font-bold text-secondary text-center mb-8">
        {competitionLabel || 'Make Your Predictions'}
      </h2>
      
      {questions?.map((q) => (
        <QuestionCard
          key={q.id}
          id={q.id}
          question={q.question}
          options={q.options}
          selectedAnswer={answers[q.id]}
          onAnswerChange={handleAnswerChange}
        />
      ))}

      <Button
        onClick={() => handleSubmit(questions || [])}
        className="w-full bg-secondary hover:bg-secondary-light text-primary py-6 text-lg rounded-lg transition-all duration-300"
      >
        Seal Your Predictions
      </Button>
    </div>
  );
};