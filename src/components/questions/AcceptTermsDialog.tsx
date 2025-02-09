
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTermsAndConditions } from "@/hooks/useTermsAndConditions";
import { LoadingState } from "../ui/LoadingState";
import { useState } from "react";
import { useTermsAcceptance } from "@/hooks/useTermsAcceptance";
import { TermsTable } from "./terms/TermsTable";
import { TermsAcceptanceFooter } from "./terms/TermsAcceptanceFooter";

interface AcceptTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcceptTerms: () => void;
}

export const AcceptTermsDialog = ({ 
  open, 
  onOpenChange, 
  onAcceptTerms 
}: AcceptTermsDialogProps) => {
  const { data: termsAndConditions, isLoading } = useTermsAndConditions();
  const [accepted, setAccepted] = useState(false);
  const { isProcessing, handleAcceptTerms } = useTermsAcceptance(onAcceptTerms);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-4 bg-mystical-100 text-primary rounded-md">
          Please read the below Terms and Conditions and click accept if you agree to them at the bottom of the page
        </div>

        <div className="flex-1 overflow-auto mt-4">
          <TermsTable termsAndConditions={termsAndConditions || []} />
        </div>

        <TermsAcceptanceFooter 
          accepted={accepted}
          onAcceptedChange={setAccepted}
          onAcceptTerms={handleAcceptTerms}
          isProcessing={isProcessing}
        />
      </DialogContent>
    </Dialog>
  );
};
