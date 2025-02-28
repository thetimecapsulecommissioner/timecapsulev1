
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search } from "lucide-react";

interface AFLPlayerSelectProps {
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
  disabled?: boolean;
}

export const AFLPlayerSelect = ({ 
  selected, 
  requiredAnswers = 1, 
  onAnswerChange,
  disabled = false 
}: AFLPlayerSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean[]>(Array(requiredAnswers).fill(false));

  const { data: players } = useQuery({
    queryKey: ['afl-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('afl_players')
        .select('*')
        .order('firstname');
      if (error) throw error;
      return data.map(player => ({
        ...player,
        fullName: `${player.firstname} ${player.surname}`
      }));
    },
  });

  // Filter players based on search and already selected items
  const getFilteredPlayers = (index: number) => {
    if (!players) return [];
    
    // Filter by search term
    const searchFiltered = searchTerm.trim() === "" 
      ? players 
      : players.filter(player => 
          player.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
    // Filter out already selected players from other selections
    return searchFiltered.filter(player => {
      // Allow the player at the current index to remain in the list
      if (selected[index] === player.fullName) {
        return true;
      }
      // Filter out players that are already selected in other positions
      return !selected.includes(player.fullName);
    });
  };

  const handleRemovePlayer = (index: number) => {
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    onAnswerChange(newSelected);
  };

  const handleSelectPlayer = (playerName: string, index: number) => {
    const newSelected = [...selected];
    newSelected[index] = playerName;
    onAnswerChange(newSelected.filter(Boolean));
    
    // Close search after selection
    toggleSearch(index, false);
  };

  const toggleSearch = (index: number, state?: boolean) => {
    setIsSearchOpen(prev => {
      const updated = [...prev];
      updated[index] = state !== undefined ? state : !prev[index];
      return updated;
    });
    
    if (!state) {
      setSearchTerm("");
    }
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers }).map((_, index) => (
        <div key={index} className="relative">
          {selected[index] && !isSearchOpen[index] ? (
            <div className="flex items-center justify-between p-2 bg-white border rounded-md">
              <span className="text-gray-900">{selected[index]}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePlayer(index)}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                  aria-label="Remove player"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSearch(index, true)}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                  aria-label="Search players"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : isSearchOpen[index] ? (
            <div className="border rounded-md overflow-hidden">
              <div className="flex items-center p-2 bg-white">
                <Input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 focus-visible:ring-0 flex-1"
                  autoFocus
                  disabled={disabled}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSearch(index, false)}
                  className="h-8 w-8 p-0 ml-1"
                  aria-label="Cancel search"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border-t">
                <ScrollArea className="h-[200px]">
                  <div className="p-1">
                    {getFilteredPlayers(index).length > 0 ? (
                      getFilteredPlayers(index).map((player) => (
                        <button
                          key={player.id}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-sm text-gray-900"
                          onClick={() => handleSelectPlayer(player.fullName, index)}
                          disabled={disabled}
                        >
                          {player.fullName} - {player.team}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        No players found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <button
              className="w-full p-2 bg-white border rounded-md text-left hover:bg-gray-50 text-gray-700"
              onClick={() => toggleSearch(index, true)}
              disabled={disabled}
            >
              Select player...
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
