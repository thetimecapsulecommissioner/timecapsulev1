import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadTemplateProps {
  type: 'competition' | 'questions';
}

export const DownloadTemplate = ({ type }: DownloadTemplateProps) => {
  const generateTemplate = () => {
    let headers: string[];
    let example: string[];

    if (type === 'competition') {
      headers = [
        'competition_id',
        'competition_type',
        'parent_competition_id',
        'competition_name',
        'sport',
        'competition_description',
        'open_date',
        'close_date',
        'event_date',
        'entry_fee',
        'prizes',
        'max_participants',
        'preseason_questions_count',
        'midseason_questions_count'
      ];

      example = [
        'afl-2025',
        'Parent',
        '',
        '2025 AFL Time Capsule',
        'AFL',
        'Make your predictions for the 2025 AFL season',
        '2025-01-01',
        '2025-03-06',
        '2025-11-15',
        '65.00',
        '1st: 60% of the Winnings Pool, 2nd: 30% of the Winnings Pool, 3rd: 10% of the Winnings Pool',
        '',
        '',
        ''
      ];
    } else {
      headers = [
        'competition_id',
        'question_id',
        'question_text',
        'response_category',
        'help_text',
        'points_value',
        'number_of_responses',
        'possible_answers'
      ];

      example = [
        'afl-2025',
        'Q1',
        'Who will win the Brownlow Medal?',
        'Player',
        'Select the player you think will win',
        '10',
        '1',
        ''
      ];
    }

    const csv = [
      headers.join(','),
      example.join(',')
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={generateTemplate} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Download Template
    </Button>
  );
};
