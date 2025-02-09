
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsAcceptanceFooterProps {
  accepted: boolean;
  onAcceptedChange: (checked: boolean) => void;
  onAcceptTerms: () => void;
  isProcessing: boolean;
}

export const TermsAcceptanceFooter = ({
  accepted,
  onAcceptedChange,
  onAcceptTerms,
  isProcessing
}: TermsAcceptanceFooterProps) => {
  return (
    <div className="mt-4 flex items-center justify-between border-t pt-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={accepted}
          onCheckedChange={(checked) => onAcceptedChange(checked as boolean)}
          className="h-5 w-5 rounded-full border-2 border-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the above Terms and Conditions
        </label>
      </div>
      <Button 
        onClick={onAcceptTerms}
        disabled={!accepted || isProcessing}
        className="bg-primary text-white hover:bg-primary-dark"
      >
        {isProcessing ? "Processing..." : "Accept and Proceed to Payment"}
      </Button>
    </div>
  );
};
