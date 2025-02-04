import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AFLPlayerSelectProps {
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
}

export const AFLPlayerSelect = ({ selected, requiredAnswers, onAnswerChange }: AFLPlayerSelectProps) => {
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

  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers || 1 }).map((_, index) => (
        <div key={index} className="w-full">
          <Select
            value={selected[index] || ""}
            onValueChange={(value) => {
              const newSelected = [...selected];
              newSelected[index] = value;
              onAnswerChange(newSelected.filter(Boolean));
            }}
          >
            <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300">
              <SelectValue placeholder={isLoading ? "Loading players..." : "Select Player"} />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-[300px]">
              {players?.map((player) => (
                <SelectItem 
                  key={player.id} 
                  value={player.fullName}
                  className="text-gray-700 hover:bg-gray-100"
                >
                  {player.fullName} - {player.team} ({player.position || 'N/A'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};