import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

interface AFLClub {
  id: string;
  name: string;
}

export const AFLClubSelect = ({ value, onChange }: AFLClubSelectProps) => {
  const { data: clubs = [], isLoading, error } = useQuery({
    queryKey: ["afl-clubs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("afl_clubs")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Error fetching AFL clubs:", error);
        throw error;
      }

      return (data || []) as AFLClub[];
    },
  });

  if (error) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What AFL Club do you support?
        </label>
        <div className="text-red-500 text-sm">Failed to load AFL clubs. Please try again later.</div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        What AFL Club do you support?
      </label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue 
            placeholder={isLoading ? "Loading clubs..." : "Select your AFL club"}
            className="text-gray-700"
          />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {clubs.map((club) => (
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