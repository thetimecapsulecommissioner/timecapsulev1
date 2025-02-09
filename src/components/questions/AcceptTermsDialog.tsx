
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

  const handleAcceptTerms = async () => {
    try {
      setIsProcessing(true);
      console.log('Starting accept terms process...');

      // First check if we have an active session
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.session) {
        console.error('Session check failed:', {
          error: sessionError,
          sessionExists: !!session?.session
        });
        throw new Error("Authentication session not found. Please try logging in again.");
      }

      console.log('Session validated:', {
        sessionExists: !!session.session,
        userExists: !!session.session?.user,
        accessToken: !!session.session.access_token
      });

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }

      if (!user || !competitionId) {
        console.error('Missing user or competition ID:', { user: !!user, competitionId });
        throw new Error("User or competition not found");
      }

      // Check if user has already paid
      const { data: existingEntry, error: entryCheckError } = await supabase
        .from('competition_entries')
        .select('payment_completed, payment_session_id')
        .eq('user_id', user.id)
        .eq('competition_id', competitionId)
        .maybeSingle();

      if (entryCheckError) {
        console.error('Error checking competition entry:', entryCheckError);
        throw entryCheckError;
      }

      if (existingEntry?.payment_completed) {
        console.log('User has already paid');
        onAcceptTerms();
        return;
      }

      console.log('User authenticated:', user.id);
      console.log('Competition ID:', competitionId);

      // Create or update competition entry
      const { error: entryError } = await supabase
        .from('competition_entries')
        .upsert({
          user_id: user.id,
          competition_id: competitionId,
          terms_accepted: true,
          testing_mode: false,
          status: 'Not Started',
          payment_completed: false
        }, {
          onConflict: 'user_id,competition_id'
        });

      if (entryError) {
        console.error('Error creating/updating entry:', entryError);
        throw entryError;
      }

      console.log('Creating Stripe checkout session...');
      
      try {
        const { data: sessionData, error: checkoutError } = await supabase.functions.invoke(
          'create-checkout',
          {
            body: { competitionId },
            headers: {
              Authorization: `Bearer ${session.session.access_token}`
            }
          }
        );

        console.log('Checkout API response:', { sessionData, error: checkoutError });

        if (checkoutError) {
          console.error('Checkout error:', checkoutError);
          throw checkoutError;
        }

        if (!sessionData?.url) {
          console.error('No checkout URL received:', sessionData);
          throw new Error('No checkout URL received');
        }

        console.log('Redirecting to checkout:', sessionData.url);
        window.location.href = sessionData.url;
        onAcceptTerms();
      } catch (invokeError) {
        console.error('Error invoking create-checkout function:', {
          error: invokeError,
          message: invokeError.message,
          details: invokeError.toString()
        });
        throw new Error(`Failed to create checkout session: ${invokeError.message}`);
      }
    } catch (error) {
      console.error('Error processing terms and payment:', {
        message: error.message,
        details: error.toString(),
        stack: error.stack
      });
      let errorMessage = "Failed to process terms and payment. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
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
            onClick={handleAcceptTerms}
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
