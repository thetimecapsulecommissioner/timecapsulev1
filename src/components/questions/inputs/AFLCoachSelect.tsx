
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AFLCoachSelectProps {
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
  disabled?: boolean;
}

export const AFLCoachSelect = ({ 
  selected, 
  requiredAnswers, 
  onAnswerChange,
  disabled = false
}: AFLCoachSelectProps) => {
  const { data: coaches, isLoading } = useQuery({
    queryKey: ['afl-coaches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('afl_coaches')
        .select('*')
        .order('firstname');
      if (error) throw error;
      
      // Map coaches without nil option
      const coachList = data.map(coach => ({
        ...coach,
        fullName: `${coach.firstname} ${coach.surname}`
      }));
      
      return coachList;
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
            disabled={disabled}
          >
            <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300">
              <SelectValue placeholder={isLoading ? "Loading coaches..." : "Select Coach"} />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-[300px]">
              {coaches?.map((coach) => (
                <SelectItem 
                  key={coach.id} 
                  value={coach.fullName}
                  className="text-gray-700 hover:bg-gray-100"
                >
                  {coach.fullName} {coach.team ? `- ${coach.team}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};
