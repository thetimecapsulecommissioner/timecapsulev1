import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AFLPlayerSelectProps {
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
  disabled?: boolean;
}

export const AFLPlayerSelect = ({ 
  selected = [], 
  requiredAnswers, 
  onAnswerChange,
  disabled = false 
}: AFLPlayerSelectProps) => {
  const [open, setOpen] = useState<boolean[]>(Array(requiredAnswers).fill(false));
  
  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ['afl-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('afl_players')
        .select('*')
        .order('firstname');
      
      if (error) {
        toast.error("Failed to load players");
        throw error;
      }
      
      return data?.map(player => ({
        ...player,
        fullName: `${player.firstname} ${player.surname}`
      })) || [];
    },
  });

  const toggleOpen = (index: number) => {
    if (disabled || isLoading) return;
    const newOpen = [...open];
    newOpen[index] = !newOpen[index];
    setOpen(newOpen);
  };

  if (error) {
    return <div className="text-red-500">Error loading players</div>;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers }).map((_, index) => (
        <Popover key={index} open={open[index]} onOpenChange={() => toggleOpen(index)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open[index]}
              className="w-full justify-between"
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                "Loading players..."
              ) : (
                selected[index] ? selected[index] : "Select player..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search players..." />
              <CommandEmpty>No player found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {players.map((player) => (
                  <CommandItem
                    key={player.id}
                    value={player.fullName}
                    onSelect={() => {
                      const newSelected = [...(selected || [])];
                      newSelected[index] = player.fullName;
                      onAnswerChange(newSelected.filter(Boolean));
                      toggleOpen(index);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected[index] === player.fullName ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {player.fullName} - {player.team} ({player.position || 'N/A'})
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};