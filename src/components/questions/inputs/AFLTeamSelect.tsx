
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AFLTeamSelectProps {
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
  disabled?: boolean;
}

export const AFLTeamSelect = ({ 
  selected, 
  requiredAnswers, 
  onAnswerChange,
  disabled = false
}: AFLTeamSelectProps) => {
  const { data: teams } = useQuery({
    queryKey: ['afl-teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('afl_teams')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const handleRemoveTeam = (index: number) => {
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    onAnswerChange(newSelected);
  };

  // Filter out already selected teams for each selection
  const getAvailableTeams = (index: number) => {
    if (!teams) return [];
    
    return teams.filter(team => {
      // Allow the team at the current index to remain in the list
      if (selected[index] === team.name) {
        return true;
      }
      // Filter out teams that are already selected in other positions
      return !selected.includes(team.name);
    });
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers }).map((_, index) => (
        <div key={index} className="flex gap-2 items-center">
          <div className="flex-1">
            <Select
              value={selected[index] || ""}
              onValueChange={(value) => {
                const newSelected = [...selected];
                newSelected[index] = value;
                onAnswerChange(newSelected.filter(Boolean));
              }}
              disabled={disabled}
            >
              <SelectTrigger className="w-full bg-white text-gray-700">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {getAvailableTeams(index).map((team) => (
                  <SelectItem 
                    key={team.id} 
                    value={team.name}
                    className="cursor-pointer"
                  >
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selected[index] && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveTeam(index)}
              disabled={disabled}
              className="h-9 w-9 p-0 shrink-0"
              aria-label="Remove team"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
