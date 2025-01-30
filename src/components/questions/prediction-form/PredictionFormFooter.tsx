import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface PredictionFormFooterProps {
  onSave: () => void;
  onSeal: () => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

export const PredictionFormFooter = ({
  onSave,
  onSeal,
  isSaving,
  isSubmitted
}: PredictionFormFooterProps) => {
  return (
    <div className="flex flex-col gap-4 items-center mt-8">
      <Button 
        onClick={onSave}
        disabled={isSaving || isSubmitted}
        className="w-full max-w-md bg-white text-green-600 hover:bg-green-50 border border-green-200"
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? "Saving..." : "Save Responses"}
      </Button>

      <Button 
        onClick={onSeal}
        disabled={isSubmitted}
        className="w-full max-w-md bg-green-600 hover:bg-green-700"
      >
        Seal Your Predictions
      </Button>
    </div>
  );
};