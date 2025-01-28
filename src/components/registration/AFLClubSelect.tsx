import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface AFLClubSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const AFLClubSelect = ({ value, onChange }: AFLClubSelectProps) => {
  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      const { data, error } = await supabase
        .from('afl_clubs')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching AFL clubs:', error);
        return;
      }

      setClubs(data || []);
    };

    fetchClubs();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">What AFL Club do you support?</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your AFL club" className="text-gray-700" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {clubs.map((club) => (
            <SelectItem key={club.id} value={club.id} className="text-gray-700">
              {club.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};