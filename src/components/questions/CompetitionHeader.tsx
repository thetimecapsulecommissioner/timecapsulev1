
import { useCountdown } from "@/hooks/useCountdown";

interface CompetitionHeaderProps {
  label: string;
  hasEntered: boolean;
}

export const CompetitionHeader = ({ label, hasEntered }: CompetitionHeaderProps) => {
  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const { timeLeft: preSeasonTimeLeft } = useCountdown(preSeasonDeadline);

  return (
    <>
      <h1 className="text-4xl font-bold text-secondary mb-8 text-center">
        {label}
      </h1>

      <div className="bg-mystical-100 p-6 rounded-lg mb-8">
        <p className="text-primary text-lg text-center">
          {hasEntered ? (
            "The Original AFL Time Capsule, focussed on finding out who truly is the biggest footy nuff! See the Pre-Season and Mid-Season Question buttons and instructions below. Pre-Season Questions due Thursday 6th of March."
          ) : (
            "The Original AFL Time Capsule, focussed on finding out who truly is the biggest footy nuff! Click below to read the terms and conditions and enter this competition, to put yourself in with a chance to win the prize-money and coveted Time Capsule Shield!"
          )}
        </p>
      </div>
    </>
  );
};
