
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TermsAndConditions } from "@/hooks/useTermsAndConditions";

interface TermsTableProps {
  termsAndConditions: TermsAndConditions[];
}

export const TermsTable = ({ termsAndConditions }: TermsTableProps) => {
  return (
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
  );
};
