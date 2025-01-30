import { useCountdown } from "@/hooks/useCountdown";

interface CompetitionHeaderProps {
  label: string;
}

export const CompetitionHeader = ({ label }: CompetitionHeaderProps) => {
  const preSeasonDeadline = new Date('2025-03-06T18:00:00+11:00');
  const { timeLeft: preSeasonTimeLeft } = useCountdown(preSeasonDeadline);

  return (
    <>
      <h1 className="text-4xl font-bold text-secondary mb-8 text-center">
        {label}
      </h1>

      <div className="bg-mystical-100 p-6 rounded-lg mb-8">
        <p className="text-primary text-lg text-center">
          The Original AFL Time Capsule, focussed on finding out who truly is the biggest footy nuff!{' '}
          <br />
          Click below to read the terms and conditions and enter this competition, to start making your predictions 
          and put yourself in with a chance to win the prize-money and coveted Time Capsule Shield!
        </p>
      </div>
    </>
  );
};