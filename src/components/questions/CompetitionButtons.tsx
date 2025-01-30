import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TermsDialog } from "./TermsDialog";
import { AcceptTermsDialog } from "./AcceptTermsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCountdown } from "@/hooks/useCountdown";

interface CompetitionButtonsProps {
  hasEntered: boolean;
  onEnterCompetition: () => void;
}

export const CompetitionButtons = ({
  hasEntered,
  onEnterCompetition,
}: CompetitionButtonsProps) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showAcceptTerms, setShowAcceptTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { id: competitionId } = useParams();

  // Define deadlines
  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const midSeasonDeadline = new Date('2025-06-14T18:00:00+10:00');
  
  const { formattedTimeLeft: preSeasonTimeLeft, timeLeft: preSeasonTime } = useCountdown(preSeasonDeadline);
  const { formattedTimeLeft: midSeasonTimeLeft, timeLeft: midSeasonTime } = useCountdown(midSeasonDeadline);

  useEffect(() => {
    const checkTermsAcceptance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !competitionId) return;

        const { data: entries, error: fetchError } = await supabase
          .from('competition_entries')
          .select('terms_accepted')
          .eq('user_id', user.id)
          .eq('competition_id', competitionId);

        if (fetchError) throw fetchError;

        if (entries && entries.length > 0) {
          if (entries[0].terms_accepted) {
            setTermsAccepted(true);
            onEnterCompetition();
          }
        } else {
          const { error: insertError } = await supabase
            .from('competition_entries')
            .insert({
              competition_id: competitionId,
              user_id: user.id,
              terms_accepted: false,
              responses_saved: 0
            });

          if (insertError) {
            console.error('Error creating competition entry:', insertError);
            toast.error("Failed to initialize competition entry");
          }
        }
      } catch (error) {
        console.error('Error checking terms acceptance:', error);
        toast.error("Failed to check terms acceptance status");
      }
    };
    
    checkTermsAcceptance();
  }, [competitionId, onEnterCompetition]);

  const handleAcceptTerms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return;

      const { error } = await supabase
        .from('competition_entries')
        .update({ terms_accepted: true })
        .eq('user_id', user.id)
        .eq('competition_id', competitionId);

      if (error) throw error;

      setTermsAccepted(true);
      setShowAcceptTerms(false);
      onEnterCompetition();
      toast.success("Terms and conditions accepted successfully!");
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast.error("Failed to accept terms and conditions");
    }
  };

  if (termsAccepted) {
    return (
      <div className="space-y-4 mt-12">
        <Button
          className="w-full h-16 flex justify-between items-center px-6 bg-mystical-100 hover:bg-mystical-200"
        >
          <span className="text-primary font-semibold w-48">Pre-Season Predictions</span>
          <div className="flex-1 flex justify-center">
            <span className={`px-3 py-1 rounded ${!preSeasonTime.expired ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
              {!preSeasonTime.expired ? 'Open' : 'Closed'}
            </span>
          </div>
          <span className="text-primary w-48 text-right">
            {preSeasonTimeLeft}
          </span>
        </Button>

        <Button
          disabled={!midSeasonTime.expired}
          className="w-full h-16 flex justify-between items-center px-6 bg-mystical-100 hover:bg-mystical-200"
        >
          <span className="text-primary font-semibold w-48">Mid-Season Predictions</span>
          <div className="flex-1 flex justify-center">
            <span className={`px-3 py-1 rounded ${!midSeasonTime.expired ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
              {!midSeasonTime.expired ? 'Open' : 'Closed'}
            </span>
          </div>
          <span className="text-primary w-48 text-right">
            {midSeasonTimeLeft}
          </span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 justify-center mb-12">
        <Button
          onClick={() => setShowAcceptTerms(true)}
          variant="outline"
          className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
        >
          Enter this Competition
        </Button>
        <Button
          onClick={() => setShowTerms(true)}
          variant="outline"
          className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
        >
          Terms and Conditions
        </Button>
      </div>

      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      <AcceptTermsDialog 
        open={showAcceptTerms} 
        onOpenChange={setShowAcceptTerms}
        onAcceptTerms={handleAcceptTerms}
      />
    </>
  );
};