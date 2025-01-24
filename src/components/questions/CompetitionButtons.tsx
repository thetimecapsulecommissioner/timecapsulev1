import { Button } from "@/components/ui/button";

interface CompetitionButtonsProps {
  hasEntered: boolean;
  preSeasonTimeLeft: string;
  onEnterCompetition: () => void;
  onShowTerms: () => void;
}

export const CompetitionButtons = ({
  hasEntered,
  preSeasonTimeLeft,
  onEnterCompetition,
  onShowTerms,
}: CompetitionButtonsProps) => {
  return (
    <>
      <div className="flex gap-4 justify-center mb-12">
        <Button
          onClick={onEnterCompetition}
          className="flex-1 bg-secondary hover:bg-secondary-light text-primary"
        >
          Enter this Competition
        </Button>
        <Button
          onClick={onShowTerms}
          variant="outline"
          className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
        >
          Terms and Conditions
        </Button>
      </div>

      <div className="space-y-4 mt-12">
        <Button
          className={`w-full h-16 flex justify-between items-center px-6 
            ${hasEntered ? 'bg-green-100 hover:bg-green-200' : 'bg-secondary hover:bg-secondary-light'}`}
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
    </>
  );
};