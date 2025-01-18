import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const sampleQuestions = [
  {
    id: 1,
    question: "By 2025, what will be the dominant mode of transportation in major cities?",
    options: ["Electric vehicles", "Flying taxis", "Autonomous vehicles", "Public transit"],
  },
  {
    id: 2,
    question: "Which technology will have the biggest impact on daily life in the next 5 years?",
    options: ["Artificial Intelligence", "Virtual Reality", "Biotechnology", "Quantum Computing"],
  },
];

export const Questions = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSubmit = () => {
    if (Object.keys(answers).length !== sampleQuestions.length) {
      toast.error("Please answer all questions");
      return;
    }
    toast.success("Predictions saved to your time capsule!");
  };

  return (
    <div className="min-h-screen bg-primary py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-secondary text-center mb-8">
          Make Your Predictions
        </h2>
        
        {sampleQuestions.map((q) => (
          <Card key={q.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{q.question}</h3>
            <RadioGroup
              onValueChange={(value) => setAnswers({ ...answers, [q.id]: value })}
              value={answers[q.id]}
            >
              <div className="space-y-3">
                {q.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                    <Label htmlFor={`${q.id}-${option}`} className="text-gray-700">{option}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>
        ))}

        <Button
          onClick={handleSubmit}
          className="w-full bg-secondary hover:bg-secondary-light text-primary py-6 text-lg rounded-lg transition-all duration-300"
        >
          Seal Your Predictions
        </Button>
      </div>
    </div>
  );
};