import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTermsAndConditions } from "@/hooks/useTermsAndConditions";
import { LoadingState } from "../ui/LoadingState";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

interface AcceptTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcceptTerms: () => void;
}

export const AcceptTermsDialog = ({ open, onOpenChange, onAcceptTerms }: AcceptTermsDialogProps) => {
  const { data: termsAndConditions, isLoading } = useTermsAndConditions();
  const [accepted, setAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { id: competitionId } = useParams();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { competitionId }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleAcceptAndPay = async () => {
    onAcceptTerms();
    await handlePayment();
  };

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rule Reference</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {termsAndConditions?.map((term) => (
                <TableRow key={term["Rule Reference"]}>
                  <TableCell className="font-medium">{term["Rule Reference"]}</TableCell>
                  <TableCell>{term.Category}</TableCell>
                  <TableCell>{term.Name}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{term.Description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
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
            onClick={handleAcceptAndPay}
            disabled={!accepted || isProcessing}
            className="bg-primary text-white hover:bg-primary-dark"
          >
            {isProcessing ? "Processing..." : "Accept and Proceed to Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};