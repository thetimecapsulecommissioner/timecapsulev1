
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CSVPreviewProps {
  data: any[];
}

export const CSVPreview = ({ data }: CSVPreviewProps) => {
  if (!data.length) return null;

  const headers = Object.keys(data[0]);
  const previewRows = data.slice(0, 5);

  return (
    <div className="my-4">
      <h3 className="text-lg font-semibold mb-2">Preview</h3>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewRows.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={`${index}-${header}`}>{row[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
