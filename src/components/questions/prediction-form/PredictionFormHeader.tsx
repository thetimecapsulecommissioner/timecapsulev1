import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const iconSize = isMobile ? 16 : 20;
  const buttonClasses = "bg-white text-green-600 hover:bg-green-50 border border-green-200";
  const textClasses = isMobile ? "text-sm" : "text-base";

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