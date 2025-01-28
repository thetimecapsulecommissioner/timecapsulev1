import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface AFLClubSelectProps {
  value: string;
  onChange: (value: string) => void;
}

interface AFLClub {
  id: string;
  name: string;
}

export const AFLClubSelect = ({ value, onChange }: AFLClubSelectProps) => {
  const [open, setOpen] = useState(false);
  const [clubs, setClubs] = useState<AFLClub[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState<string>("");

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
      
      // Set the selected club name if we have a value
      if (value) {
        const club = data?.find(c => c.id === value);
        if (club) {
          setSelectedClub(club.name);
        }
      }
    };

    fetchClubs();
  }, [value]);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        What AFL Club do you support?
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedClub || "Select AFL club..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border border-gray-200">
          <Command>
            <CommandInput 
              placeholder="Search AFL club..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9 text-gray-700 border-none focus:ring-0"
            />
            <CommandEmpty className="p-2 text-sm text-gray-700">
              No AFL club found.
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {filteredClubs.map((club) => (
                <CommandItem
                  key={club.id}
                  value={club.name}
                  onSelect={() => {
                    setSelectedClub(club.name);
                    onChange(club.id);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === club.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {club.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};