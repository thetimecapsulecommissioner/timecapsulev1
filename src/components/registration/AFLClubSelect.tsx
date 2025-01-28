import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AFLClubSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const AFLClubSelect = ({ value, onChange }: AFLClubSelectProps) => {
  const [open, setOpen] = useState(false);

  const { data: clubs, isLoading } = useQuery({
    queryKey: ["afl-clubs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("afl_clubs")
        .select("id, name")
        .order("name");

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });

  const selectedClub = clubs?.find((club) => club.id === value)?.name;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        What AFL Club do you support?
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            {isLoading
              ? "Loading clubs..."
              : selectedClub || "Select your AFL club..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search AFL clubs..." />
            <CommandEmpty>No AFL club found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {clubs?.map((club) => (
                <CommandItem
                  key={club.id}
                  value={club.name}
                  onSelect={() => {
                    onChange(club.id);
                    setOpen(false);
                  }}
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