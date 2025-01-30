import { ProfileDropdown } from "./ProfileDropdown";
import { useParams } from "react-router-dom";
import { useCompetition } from "@/hooks/useCompetition";
import { PredictionForm } from "./questions/PredictionForm";
import { LoadingState } from "./ui/LoadingState";
import { Logo } from "./navigation/Logo";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { supabase } from "@/integrations/supabase/client";
import { CompetitionButtons } from "./questions/CompetitionButtons";
import { useQuery } from "@tanstack/react-query";

export const Questions = () => {
  const { id: competitionId } = useParams();
  const { data: competition, isLoading: competitionLoading } = useCompetition(competitionId);
  const [hasEntered, setHasEntered] = useState(false);
  const navigate = useNavigate();

  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const { timeLeft: preSeasonTimeLeft } = useCountdown(preSeasonDeadline);

  // Fetch questions
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

  // Check if user has already entered competition and get prediction count
  const { data: entry, isLoading: entryLoading } = useQuery({
    queryKey: ['competition-entry', competitionId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !competitionId) return null;

      // Get competition entry
      const { data: entryData, error: entryError } = await supabase
        .from('competition_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('competition_id', competitionId)
        .maybeSingle();

      if (entryError) throw entryError;

      // Get prediction count
      const { count, error: countError } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) throw countError;

      return {
        ...entryData,
        predictions_count: count || 0
      };
    },
    refetchInterval: 5000, // Refetch every 5 seconds to keep count updated
  });

  useEffect(() => {
    if (entry?.terms_accepted) {
      setHasEntered(true);
    }
  }, [entry]);

  // Update competition entry with prediction count
  useEffect(() => {
    const updatePredictionCount = async () => {
      if (entry?.predictions_count !== undefined && competitionId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('competition_entries')
          .update({ responses_saved: entry.predictions_count })
          .eq('user_id', user.id)
          .eq('competition_id', competitionId);
      }
    };

    updatePredictionCount();
  }, [entry?.predictions_count, competitionId]);

  const handleLogoClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  if (competitionLoading || questionsLoading || entryLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="fixed top-4 left-4 z-50">
        <Logo onClick={handleLogoClick} />
      </div>
      <div className="fixed top-4 right-4 z-50">
        <ProfileDropdown />
      </div>
      
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <h1 className="text-4xl font-bold text-secondary mb-8 text-center">
          {competition?.label}
        </h1>

        <div className="bg-mystical-100 p-6 rounded-lg mb-8">
          <p className="text-primary text-lg text-center">
            The Original AFL Time Capsule, focussed on finding out who truly is the biggest footy nuff!{' '}
            <br />
            Click below to read the terms and conditions and enter this competition, to start making your predictions 
            and put yourself in with a chance to win the prize-money and coveted Time Capsule Shield!
          </p>
        </div>

        {!hasEntered && (
          <CompetitionButtons
            hasEntered={hasEntered}
            preSeasonTimeLeft={preSeasonTimeLeft}
            onEnterCompetition={() => setHasEntered(true)}
          />
        )}

        {hasEntered && questions && (
          <>
            <h2 className="text-2xl font-bold text-secondary mb-8 text-center">
              2025 AFL Time Capsule
            </h2>
            <PredictionForm 
              questions={questions} 
              answeredQuestions={entry?.predictions_count || 0}
            />
          </>
        )}
      </div>
    </div>
  );
};