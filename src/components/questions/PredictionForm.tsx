import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { QuestionCard } from "./QuestionCard";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface PredictionFormProps {
  questions: any[];
  answeredQuestions: number;
}

export const PredictionForm = ({ questions, answeredQuestions }: PredictionFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [showSealDialog, setShowSealDialog] = useState(false);
  const [comments, setComments] = useState<Record<number, string>>({});
  const { id: competitionId } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch existing predictions
  const { data: predictions } = useQuery({
    queryKey: ['predictions', competitionId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('response_order');

      if (error) throw error;
      
      // Check if predictions are submitted
      if (data && data.length > 0) {
        setIsSubmitted(data[0].submitted);
      }

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

  // Fetch existing comments
  const { data: savedComments } = useQuery({
    queryKey: ['prediction-comments', competitionId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('prediction_comments')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const commentMap: Record<number, string> = {};
      data?.forEach(comment => {
        commentMap[comment.question_id] = comment.comment || '';
      });
      
      return commentMap;
    },
  });

  useEffect(() => {
    if (savedComments) {
      setComments(savedComments);
    }
  }, [savedComments]);

  const handleSaveResponses = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      // First check if entry exists
      const { data: entries, error: fetchError } = await supabase
        .from('competition_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('competition_id', competitionId);

      if (fetchError) throw fetchError;

      if (!entries || entries.length === 0) {
        // Create new entry if it doesn't exist
        const { error: insertError } = await supabase
          .from('competition_entries')
          .insert({
            competition_id: competitionId,
            user_id: user.id,
            responses_saved: answeredQuestions,
            status: 'In Progress'
          });

        if (insertError) throw insertError;
      } else {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('competition_entries')
          .update({ 
            responses_saved: answeredQuestions,
            status: 'In Progress'
          })
          .eq('user_id', user.id)
          .eq('competition_id', competitionId);

        if (updateError) throw updateError;
      }

      // Save comments
      for (const [questionId, comment] of Object.entries(comments)) {
        if (comment !== undefined) {
          const { error: commentError } = await supabase
            .from('prediction_comments')
            .upsert({
              user_id: user.id,
              question_id: parseInt(questionId),
              comment: comment
            }, {
              onConflict: 'user_id,question_id'
            });

          if (commentError) throw commentError;
        }
      }

      toast.success("Responses and comments saved successfully!");
    } catch (error) {
      console.error('Error saving responses:', error);
      toast.error("Failed to save responses");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSealPredictions = async () => {
    try {
      setIsSealing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      // Update predictions to submitted
      const { error: predictionError } = await supabase
        .from('predictions')
        .update({ submitted: true })
        .eq('user_id', user.id);

      if (predictionError) throw predictionError;

      // Update competition entry status
      const { error: entryError } = await supabase
        .from('competition_entries')
        .update({ status: 'Submitted' })
        .eq('user_id', user.id)
        .eq('competition_id', competitionId);

      if (entryError) throw entryError;

      setIsSubmitted(true);
      setShowSealDialog(false);
      toast.success("Predictions sealed successfully!");
    } catch (error) {
      console.error('Error sealing predictions:', error);
      toast.error("Failed to seal predictions");
    } finally {
      setIsSealing(false);
    }
  };

  const handleCommentChange = (questionId: number, comment: string) => {
    setComments(prev => ({
      ...prev,
      [questionId]: comment
    }));
  };

  return (
    <div className="space-y-8">
      <Button 
        onClick={handleSaveResponses}
        disabled={isSaving || isSubmitted}
        className="w-full max-w-md mx-auto mb-8"
      >
        {isSaving ? "Saving..." : "Save Responses"}
      </Button>

      {questions?.map((question) => (
        <div key={question.id} className="space-y-4">
          <QuestionCard
            id={question.id}
            question={question.question}
            options={question.options}
            selectedAnswer={predictions?.[question.id] || []}
            helpText={question.help_text}
            responseCategory={question.response_category}
            points={question.points}
            requiredAnswers={question.required_answers}
            onAnswerChange={(questionId, value, responseOrder) => {
              // Handle answer change logic
            }}
            disabled={isSubmitted}
          />
          <Textarea
            placeholder="Add a comment about your response (optional)"
            value={comments[question.id] || ''}
            onChange={(e) => handleCommentChange(question.id, e.target.value)}
            className="mt-2"
            disabled={isSubmitted}
          />
        </div>
      ))}

      <div className="flex flex-col gap-4 items-center mt-8">
        <Button 
          onClick={handleSaveResponses}
          disabled={isSaving || isSubmitted}
          className="w-full max-w-md"
        >
          {isSaving ? "Saving..." : "Save Responses"}
        </Button>

        <Button 
          onClick={() => setShowSealDialog(true)}
          disabled={isSubmitted}
          className="w-full max-w-md bg-green-600 hover:bg-green-700"
        >
          Seal Your Predictions
        </Button>
      </div>

      <Dialog open={showSealDialog} onOpenChange={setShowSealDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Once Predictions are sealed, you won't be able to edit them, so make sure your responses are final!
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSealDialog(false)}>
              Go back
            </Button>
            <Button 
              onClick={handleSealPredictions}
              disabled={isSealing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSealing ? "Sealing..." : "Seal my Predictions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};