
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { QuestionHeader } from "./QuestionHeader";
import { QuestionInput } from "./inputs/QuestionInput";
import { supabase } from "@/integrations/supabase/client";

interface QuestionCardProps {
  id: number;
  question: string;
  options: string[];
  selectedAnswer: string[];
  helpText?: string;
  responseCategory?: string;
  points?: number;
  requiredAnswers?: number;
  onAnswerChange: (questionId: number, value: string[], responseOrder?: number) => void;
  disabled?: boolean;
}

export const QuestionCard = ({ 
  id, 
  question, 
  options, 
  selectedAnswer = [],
  helpText,
  responseCategory,
  points,
  requiredAnswers = 1,
  onAnswerChange,
  disabled = false
}: QuestionCardProps) => {
  const [selected, setSelected] = useState<string[]>(selectedAnswer);
  const [userAFLTeam, setUserAFLTeam] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<string[]>([]);

  // Debug response categories and options
  useEffect(() => {
    if (id === 3) {
      console.log(`Question ${id} responseCategory:`, responseCategory);
      console.log(`Question ${id} options:`, options);
    }
  }, [id, responseCategory, options]);

  // Load coaches for Question 3
  useEffect(() => {
    if (id === 3 && responseCategory === "AFL Coaches") {
      const fetchCoaches = async () => {
        const { data } = await supabase
          .from('afl_coaches')
          .select('firstname, surname, team');
        
        if (data) {
          const coachList = data.map(coach => {
            const fullName = coach.surname 
              ? `${coach.firstname} ${coach.surname}`
              : coach.firstname;
            return `${fullName} (${coach.team})`;
          });
          
          // Add "nil" to the coaches list
          const coachesWithNil = [...coachList, "nil"];
          setCoaches(coachesWithNil);
          console.log("Coaches with nil:", coachesWithNil);
        }
      };
      
      fetchCoaches();
    }
  }, [id, responseCategory]);

  useEffect(() => {
    if (id === 24) {
      const loadUserAFLTeam = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('afl_team')
            .eq('id', user.id)
            .single();
          
          if (data) {
            setUserAFLTeam(data.afl_team);
          }
        }
      };
      loadUserAFLTeam();
    }
  }, [id]);

  const handleAnswerChange = (value: string[], responseOrder?: number) => {
    if (disabled) return;
    
    if (["Multiple Choice", "AFL Teams", "AFL Players", "AFL Coaches"].includes(responseCategory || "")) {
      if (value.length <= requiredAnswers) {
        setSelected(value);
        onAnswerChange(id, value, responseOrder);
      }
    } else {
      setSelected(value);
      onAnswerChange(id, value, responseOrder);
    }
  };

  // Create a modified version of the QuestionInput component specifically for Question 3
  const getQuestionInput = () => {
    // For question 3, which is coaches question, provide our custom coaches list with nil
    if (id === 3 && responseCategory === "AFL Coaches" && coaches.length > 0) {
      return (
        <QuestionInput
          id={id}
          responseCategory="Custom"
          options={coaches}
          selected={selected}
          requiredAnswers={requiredAnswers}
          onAnswerChange={handleAnswerChange}
          disabled={disabled}
        />
      );
    }
    
    // For all other questions, use the standard component
    return (
      <QuestionInput
        id={id}
        responseCategory={responseCategory}
        options={options}
        selected={selected}
        requiredAnswers={requiredAnswers}
        onAnswerChange={handleAnswerChange}
        disabled={disabled}
      />
    );
  };

  return (
    <Card className="p-6 bg-mystical-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <QuestionHeader 
        question={question}
        helpText={helpText}
        points={points}
      />
      {requiredAnswers > 1 && (
        <p className="text-sm text-gray-500 mb-4">
          Select {requiredAnswers} answers
        </p>
      )}
      {id === 24 && userAFLTeam && (
        <div className="mb-4 text-gray-700">
          <p>Your registered AFL team: <span className="font-semibold">{userAFLTeam}</span></p>
        </div>
      )}
      {id === 14 && (
        <div className="mb-4 text-gray-700">
          <p>This is a complete list of all AFL Players, confirm whether they have made the All Australian Team before at the below link.</p>
          <a 
            href="https://www.afl.com.au/all-australian/history" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            All Previous All Australian Players
          </a>
        </div>
      )}
      {getQuestionInput()}
    </Card>
  );
};
