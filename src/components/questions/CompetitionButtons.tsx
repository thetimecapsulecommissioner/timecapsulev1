import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TermsDialog } from "./TermsDialog";
import { AcceptTermsDialog } from "./AcceptTermsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface CompetitionButtonsProps {
  hasEntered: boolean;
  preSeasonTimeLeft: string;
  onEnterCompetition: () => void;
}

export const CompetitionButtons = ({
  hasEntered,
  preSeasonTimeLeft,
  onEnterCompetition,
}: CompetitionButtonsProps) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showAcceptTerms, setShowAcceptTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { id: competitionId } = useParams();

  useEffect(() => {
    const checkTermsAcceptance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && competitionId) {
          // Try to get existing entry
          const { data: entry } = await supabase
            .from('competition_entries')
            .select('terms_accepted')
            .eq('user_id', user.id)
            .eq('competition_id', competitionId)
            .maybeSingle();
          
          if (entry?.terms_accepted) {
            setTermsAccepted(true);
            onEnterCompetition();
          } else if (!entry) {
            // Create initial entry if it doesn't exist
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
        .upsert({
          competition_id: competitionId,
          user_id: user.id,
          terms_accepted: true,
          responses_saved: 0
        });

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
          className="w-full h-16 flex justify-between items-center px-6 bg-green-100 hover:bg-green-200"
        >
          <span className="text-primary font-semibold w-48">Pre-Season Predictions</span>
          <div className="flex-1 flex justify-center">
            <span className="px-3 py-1 rounded bg-green-500 text-white">Open</span>
          </div>
          <span className="text-primary w-48 text-right">
            {preSeasonTimeLeft}
          </span>
        </Button>

        <Button
          disabled
          className="w-full h-16 flex justify-between items-center px-6 bg-gray-200"
        >
          <span className="text-primary font-semibold w-48">Mid-Season Predictions</span>
          <div className="flex-1 flex justify-center">
            <span className="px-3 py-1 rounded bg-gray-400 text-white">Closed</span>
          </div>
          <span className="w-48"></span>
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