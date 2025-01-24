import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTermsAndConditions } from "@/hooks/useTermsAndConditions";

interface TermsAndConditionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TermsAndConditionsDialog = ({ open, onOpenChange }: TermsAndConditionsDialogProps) => {
  const { data: termsAndConditions = [] } = useTermsAndConditions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Terms and Conditions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rule Reference</TableHead>
                <TableHead className="w-[150px]">Rule Category</TableHead>
                <TableHead className="w-[200px]">Rule Label</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {termsAndConditions.map((term) => (
                <TableRow key={term["Rule Reference"]}>
                  <TableCell className="font-medium">{term["Rule Reference"]}</TableCell>
                  <TableCell>{term.Category}</TableCell>
                  <TableCell>{term.Name}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{term.Description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};