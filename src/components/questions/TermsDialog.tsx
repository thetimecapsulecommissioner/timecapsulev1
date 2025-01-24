import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "../ui/LoadingState";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TermsDialog = ({ open, onOpenChange }: TermsDialogProps) => {
  const { data: terms, isLoading } = useQuery({
    queryKey: ['terms-and-conditions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Terms and Conditions 2025 AFL Time Capsule')
        .select('*')
        .order('"Rule Reference"');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] h-[80vh] flex flex-col">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-xl font-bold">
            Terms and Conditions
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
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
              {terms?.map((term) => (
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
      </DialogContent>
    </Dialog>
  );
};