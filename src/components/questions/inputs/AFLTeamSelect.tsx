import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AFL_CLUBS = [
  "Adelaide Crows",
  "Brisbane Lions",
  "Carlton Blues",
  "Collingwood Magpies",
  "Essendon Bombers",
  "Fremantle Dockers",
  "Geelong Cats",
  "Gold Coast Suns",
  "GWS Giants",
  "Hawthorn Hawks",
  "Melbourne Demons",
  "North Melbourne Kangaroos",
  "Port Adelaide Power",
  "Richmond Tigers",
  "St Kilda Saints",
  "Sydney Swans",
  "West Coast Eagles",
  "Western Bulldogs"
];

interface AFLTeamSelectProps {
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
}

export const AFLTeamSelect = ({ selected, requiredAnswers, onAnswerChange }: AFLTeamSelectProps) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers || 1 }).map((_, index) => (
        <div key={index} className="w-full">
          <Select
            value={selected[index] || ""}
            onValueChange={(value) => {
              const newSelected = [...selected];
              newSelected[index] = value;
              onAnswerChange(newSelected.filter(Boolean));
            }}
          >
            <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300">
              <SelectValue placeholder="Select AFL Club" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {AFL_CLUBS.map((club) => (
                <SelectItem 
                  key={club} 
                  value={club}
                  className="text-gray-700 hover:bg-gray-100"
                >
                  {club}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};