
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const filteredPlayers = players?.filter(player => 
    player.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRefs.current.some(ref => ref?.contains(event.target as Node))) {
        setActiveIndex(null);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlayerSelect = (playerName: string, index: number) => {
    const newSelected = [...selected];
    newSelected[index] = playerName;
    onAnswerChange(newSelected.filter(Boolean));
    setSearchTerm("");
    setActiveIndex(null);
  };

  const handleRemovePlayer = (index: number) => {
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    onAnswerChange(newSelected);
  };

  const handleInputFocus = (index: number) => {
    if (!disabled) {
      setActiveIndex(index);
    }
  };

  const toggleDropdown = (index: number) => {
    if (!disabled) {
      setActiveIndex(activeIndex === index ? null : index);
      setSearchTerm("");
    }
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers }).map((_, index) => (
        <div 
          key={index} 
          className="relative" 
          ref={el => containerRefs.current[index] = el}
        >
          {selected[index] ? (
            <div 
              className="flex items-center gap-2 p-2 bg-white border rounded-md cursor-pointer group"
              onClick={() => toggleDropdown(index)}
            >
              <span className="flex-1 text-gray-900">{selected[index]}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePlayer(index);
                  }}
                  disabled={disabled}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          ) : (
            <>
              <Input
                type="text"
                placeholder="Search players..."
                value={activeIndex === index ? searchTerm : ""}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => handleInputFocus(index)}
                className="w-full bg-white text-gray-900 placeholder:text-gray-500 cursor-text p-3"
                autoComplete="off"
                disabled={disabled}
              />
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
            </>
          )}
          
          {activeIndex === index && filteredPlayers && filteredPlayers.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
              <ScrollArea className="h-[200px]">
                <div className="p-1">
                  {filteredPlayers.map((player) => (
                    <button
                      key={player.id}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-sm text-gray-900"
                      onClick={() => handlePlayerSelect(player.fullName, index)}
                      disabled={disabled}
                    >
                      {player.fullName} - {player.team}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
