import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";

interface PredictionFormHeaderProps {
  onSave: () => void;
  onShowTerms: () => void;
  isSaving: boolean;
  isSubmitted: boolean;
}

export const PredictionFormHeader = ({ 
  onSave, 
  onShowTerms, 
  isSaving, 
  isSubmitted 
}: PredictionFormHeaderProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <Button 
        onClick={onSave}
        disabled={isSaving || isSubmitted}
        className="bg-white text-green-600 hover:bg-green-50 border border-green-200"
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? "Saving..." : "Save Responses"}
      </Button>
      <Button
        onClick={onShowTerms}
        variant="outline"
        className="bg-white text-green-600 hover:bg-green-50 border border-green-200"
      >
        <FileText className="w-4 h-4 mr-2" />
        Terms and Conditions
      </Button>
    </div>
  );
};