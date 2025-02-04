import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    player.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
    setIsOpen(false);
  };

  const handleRemovePlayer = (index: number) => {
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    onAnswerChange(newSelected);
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers }).map((_, index) => (
        <div key={index} className="relative" ref={containerRef}>
          {selected[index] ? (
            <div className="flex items-center gap-2 p-2 bg-white border rounded-md">
              <span className="flex-1 text-gray-900">{selected[index]}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePlayer(index)}
                disabled={disabled}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className="w-full bg-white text-gray-900 placeholder:text-gray-500 cursor-text p-3"
                autoComplete="off"
                disabled={disabled}
              />
              {isOpen && filteredPlayers && filteredPlayers.length > 0 && (
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};