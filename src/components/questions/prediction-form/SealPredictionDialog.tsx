import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SealPredictionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSealing: boolean;
}

export const SealPredictionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isSealing
}: SealPredictionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Warning</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Once Predictions are sealed, you won't be able to edit them, so make sure your responses are final!
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Go back
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isSealing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSealing ? "Sealing..." : "Seal my Predictions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};