import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface AFLPlayerSelectProps {
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
  disabled?: boolean;
}

interface Player {
  id: string;
  firstname: string;
  surname: string;
  team: string;
  position: string | null;
  fullName: string;
}

export const AFLPlayerSelect = ({ 
  selected = [], 
  requiredAnswers, 
  onAnswerChange,
  disabled = false 
}: AFLPlayerSelectProps) => {
  const [openStates, setOpenStates] = useState<boolean[]>(Array(requiredAnswers).fill(false));
  
  const { data: players, isLoading, error } = useQuery<Player[]>({
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
      
      return (data || []).map(player => ({
        ...player,
        fullName: `${player.firstname} ${player.surname}`
      }));
    },
    initialData: [],
  });

  const handleToggle = (index: number) => {
    if (disabled || isLoading) return;
    setOpenStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleSelect = (index: number, playerName: string) => {
    const newSelected = [...selected];
    newSelected[index] = playerName;
    onAnswerChange(newSelected.filter(Boolean));
    handleToggle(index);
  };

  if (error) {
    return <div className="text-red-500">Error loading players</div>;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers }).map((_, index) => (
        <Popover 
          key={index} 
          open={openStates[index]} 
          onOpenChange={() => handleToggle(index)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStates[index]}
              className="w-full justify-between"
              disabled={disabled || isLoading}
            >
              {isLoading ? "Loading players..." : (selected[index] || "Select player...")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <ScrollArea className="h-[300px] p-1">
              <div className="space-y-1">
                {players.map((player) => (
                  <Button
                    key={player.id}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => handleSelect(index, player.fullName)}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selected[index] === player.fullName ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">
                      {player.fullName} - {player.team} {player.position ? `(${player.position})` : ''}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};