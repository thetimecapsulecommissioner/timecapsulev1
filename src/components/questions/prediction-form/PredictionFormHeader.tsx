
import { Button } from "@/components/ui/button";
import { Save, FileText, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PredictionFormHeaderProps {
  onSave: () => void;
  onShowTerms: () => void;
  isSaving: boolean;
  isSubmitted: boolean;
  isTimeExpired?: boolean;
}

export const PredictionFormHeader = ({ 
  onSave, 
  onShowTerms, 
  isSaving, 
  isSubmitted,
  isTimeExpired = false
}: PredictionFormHeaderProps) => {
  const isMobile = useIsMobile();
  const iconSize = isMobile ? 16 : 20;
  const buttonClasses = "bg-white text-green-600 hover:bg-green-50 border border-green-200";
  const textClasses = isMobile ? "text-sm" : "text-base";

  // Show time expired notice if competition has ended
  if (isTimeExpired) {
    return (
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="p-3 bg-amber-100 text-amber-800 rounded-md flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          <span>Competition time has expired. Predictions can no longer be updated.</span>
        </div>
        <Button
          onClick={onShowTerms}
          variant="outline"
          className={`${buttonClasses} ${textClasses}`}
          size={isMobile ? "sm" : "default"}
        >
          <FileText className={`w-${iconSize} h-${iconSize} mr-2`} />
          Terms and Conditions
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
      <Button 
        onClick={onSave}
        disabled={isSaving || isSubmitted}
        className={`${buttonClasses} ${textClasses}`}
        size={isMobile ? "sm" : "default"}
      >
        <Save className={`w-${iconSize} h-${iconSize} mr-2`} />
        {isSaving ? "Saving..." : "Save Responses"}
      </Button>
      <Button
        onClick={onShowTerms}
        variant="outline"
        className={`${buttonClasses} ${textClasses}`}
        size={isMobile ? "sm" : "default"}
      >
        <FileText className={`w-${iconSize} h-${iconSize} mr-2`} />
        Terms and Conditions
      </Button>
    </div>
  );
};
