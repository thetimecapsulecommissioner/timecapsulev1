import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./QuestionCard";
import { usePredictions } from "@/hooks/usePredictions";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

interface PredictionFormProps {
  competitionLabel?: string;
}

export const PredictionForm = ({ competitionLabel }: PredictionFormProps) => {
  const { answers, handleAnswerChange, handleSubmit } = usePredictions();
  const { id: competitionId } = useParams();

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

  const handleSaveResponses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      const answeredQuestions = Object.keys(answers).length;

      const { error } = await supabase
        .from('competition_entries')
        .update({ responses_saved: answeredQuestions })
        .eq('user_id', user.id)
        .eq('competition_id', competitionId);

      if (error) throw error;
      toast.success("Responses saved successfully!");
    } catch (error) {
      console.error('Error saving responses:', error);
      toast.error("Failed to save responses");
    }
  };

  const validateAnswers = () => {
    if (!questions) return false;
    
    for (const question of questions) {
      const answer = answers[question.id] || [];
      if (!answer.length || (question.required_answers && answer.length !== question.required_answers)) {
        toast.error(`Please answer all questions with the required number of responses`);
        return false;
      }
    }
    return true;
  };

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
          selectedAnswer={answers[q.id] || []}
          helpText={q.help_text}
          responseCategory={q.response_category}
          points={q.points}
          requiredAnswers={q.required_answers}
          onAnswerChange={handleAnswerChange}
        />
      ))}

      <div className="space-y-4">
        <Button
          onClick={handleSaveResponses}
          className="w-full bg-primary hover:bg-primary-dark text-white py-6 text-lg rounded-lg transition-all duration-300"
        >
          Save Responses
        </Button>

        <Button
          onClick={() => {
            if (validateAnswers()) {
              handleSubmit(questions || []);
            }
          }}
          className="w-full bg-secondary hover:bg-secondary-light text-primary py-6 text-lg rounded-lg transition-all duration-300"
        >
          Seal Your Predictions
        </Button>
      </div>
    </div>
  );
};