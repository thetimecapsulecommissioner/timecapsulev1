import { Button } from "@/components/ui/button";

interface EntryButtonsProps {
  onEnterClick: () => void;
  onTermsClick: () => void;
}

export const EntryButtons = ({ onEnterClick, onTermsClick }: EntryButtonsProps) => {
  return (
    <div className="flex gap-4 justify-center mb-12">
      <Button
        onClick={onEnterClick}
        variant="outline"
        className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
      >
        Enter this Competition
      </Button>
      <Button
        onClick={onTermsClick}
        variant="outline"
        className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
      >
        Terms and Conditions
      </Button>
    </div>
  );
};