import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface AFLPlayerSelectProps {
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
}

export const AFLPlayerSelect = ({ selected, requiredAnswers = 1, onAnswerChange }: AFLPlayerSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: players, isLoading } = useQuery({
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

  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers }).map((_, index) => (
        <div key={index} className="w-full">
          <Select
            value={selected[index] || ""}
            onValueChange={(value) => {
              const newSelected = [...selected];
              newSelected[index] = value;
              onAnswerChange(newSelected.filter(Boolean));
              setSearchTerm("");
            }}
          >
            <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300">
              <SelectValue placeholder={isLoading ? "Loading players..." : "Select Player"} />
            </SelectTrigger>
            <SelectContent 
              position="popper" 
              className="w-full bg-white"
              sideOffset={5}
            >
              <div className="p-2 bg-white border-b">
                <Input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto p-1">
                {filteredPlayers?.map((player) => (
                  <SelectItem 
                    key={player.id} 
                    value={player.fullName}
                    className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {player.fullName} - {player.team}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};