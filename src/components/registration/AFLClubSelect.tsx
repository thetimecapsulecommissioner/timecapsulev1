import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AFLClubSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const AFL_CLUBS = [
  { id: "adelaide", name: "Adelaide Crows" },
  { id: "brisbane", name: "Brisbane Lions" },
  { id: "carlton", name: "Carlton Blues" },
  { id: "collingwood", name: "Collingwood Magpies" },
  { id: "essendon", name: "Essendon Bombers" },
  { id: "fremantle", name: "Fremantle Dockers" },
  { id: "geelong", name: "Geelong Cats" },
  { id: "goldcoast", name: "Gold Coast Suns" },
  { id: "gws", name: "GWS Giants" },
  { id: "hawthorn", name: "Hawthorn Hawks" },
  { id: "melbourne", name: "Melbourne Demons" },
  { id: "north", name: "North Melbourne Kangaroos" },
  { id: "port", name: "Port Adelaide Power" },
  { id: "richmond", name: "Richmond Tigers" },
  { id: "stkilda", name: "St Kilda Saints" },
  { id: "sydney", name: "Sydney Swans" },
  { id: "westcoast", name: "West Coast Eagles" },
  { id: "bulldogs", name: "Western Bulldogs" },
];

export const AFLClubSelect = ({ value, onChange }: AFLClubSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">AFL Club</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your AFL club" className="text-gray-700" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {AFL_CLUBS.map((club) => (
            <SelectItem 
              key={club.id} 
              value={club.id}
              className="text-gray-700"
            >
              {club.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};