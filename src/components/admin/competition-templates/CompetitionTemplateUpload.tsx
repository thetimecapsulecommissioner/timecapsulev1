
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCompetitionTemplateUpload } from "./hooks/useCompetitionTemplateUpload";
import { DownloadTemplate } from "./DownloadTemplate";
import { CSVPreview } from "./CSVPreview";

export const CompetitionTemplateUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const { uploadTemplate, previewData, isLoading } = useCompetitionTemplateUpload();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && !selectedFile.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    await uploadTemplate(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upload Competition Template</h2>
        <DownloadTemplate type="competition" />
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        <Button 
          onClick={handleUpload}
          disabled={!file || isLoading}
        >
          Upload
        </Button>
      </div>

      {previewData && <CSVPreview data={previewData} />}
    </div>
  );
};
