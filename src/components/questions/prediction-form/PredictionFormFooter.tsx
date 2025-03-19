
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface PredictionFormFooterProps {
  onSave: () => void;
  isSaving: boolean;
  isSubmitted: boolean;
  isTimeExpired?: boolean;
}

export const PredictionFormFooter = ({
  onSave,
  isSaving,
  isSubmitted,
  isTimeExpired = false
}: PredictionFormFooterProps) => {
  if (isTimeExpired) {
    return null; // Don't show save button if time expired
  }

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
    </div>
  );
};
