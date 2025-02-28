
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AFLCoachWithNilSelectProps {
  selected: string[];
  requiredAnswers: number;
  onAnswerChange: (value: string[]) => void;
  disabled?: boolean;
}

export const AFLCoachWithNilSelect = ({ 
  selected, 
  requiredAnswers, 
  onAnswerChange,
  disabled = false
}: AFLCoachWithNilSelectProps) => {
  const { data: coaches, isLoading } = useQuery({
    queryKey: ['afl-coaches-with-nil'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('afl_coaches')
        .select('*')
        .order('firstname');
      if (error) throw error;
      
      // Map coaches
      const coachList = data.map(coach => ({
        ...coach,
        fullName: `${coach.firstname} ${coach.surname}`
      }));
      
      // Add nil as an option with all required properties
      coachList.push({
        id: 'nil',
        firstname: 'nil',
        surname: '',
        team: '',
        fullName: 'nil',
        updated_at: new Date().toISOString()
      });
      
      return coachList;
    },
  });

  const handleRemoveCoach = (index: number) => {
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    onAnswerChange(newSelected);
  };

  // Filter out already selected coaches for each selection
  const getAvailableCoaches = (index: number) => {
    if (!coaches) return [];
    
    return coaches.filter(coach => {
      // Allow the coach at the current index to remain in the list
      if (selected[index] === coach.fullName) {
        return true;
      }
      // Filter out coaches that are already selected in other positions
      return !selected.includes(coach.fullName);
    });
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: requiredAnswers || 1 }).map((_, index) => (
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
              <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300">
                <SelectValue placeholder={isLoading ? "Loading coaches..." : "Select Coach"} />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                {getAvailableCoaches(index).map((coach) => (
                  <SelectItem 
                    key={coach.id} 
                    value={coach.fullName}
                    className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {coach.fullName} {coach.team ? `- ${coach.team}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selected[index] && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveCoach(index)}
              disabled={disabled}
              className="h-9 w-9 p-0 shrink-0"
              aria-label="Remove coach"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
