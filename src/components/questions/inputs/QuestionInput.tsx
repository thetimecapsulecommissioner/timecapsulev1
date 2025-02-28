
import { AFLTeamSelect } from "./AFLTeamSelect";
import { MultipleChoiceInput } from "./MultipleChoiceInput";
import { NumberSelect } from "./NumberSelect";
import { RadioInput } from "./RadioInput";
import { AFLPlayerSelect } from "./AFLPlayerSelect";
import { AFLCoachSelect } from "./AFLCoachSelect";
import { FreeTextInput } from "./FreeTextInput";
import { usePredictions } from "@/hooks/usePredictions";

interface QuestionInputProps {
  id: number;
  responseCategory?: string;
  options: string[];
  selected: string[];
  requiredAnswers?: number;
  onAnswerChange: (value: string[], responseOrder?: number) => void;
  disabled?: boolean;
}

export const QuestionInput = ({
  id,
  responseCategory,
  options,
  selected,
  requiredAnswers = 1,
  onAnswerChange,
  disabled = false
}: QuestionInputProps) => {
  const { predictions } = usePredictions();
  
  // Get all selected answers for this question across all response orders
  const getAllSelectedAnswers = (questionId: number): string[] => {
    if (!predictions || !predictions[questionId]) return [];
    return Object.values(predictions[questionId]).filter(Boolean) as string[];
  };

  const commonProps = {
    disabled: disabled
  };

  // For debugging
  if (id === 3) {
    console.log(`Input component for Q3: ${responseCategory}`, options);
  }

  switch (responseCategory) {
    case "AFL Teams":
      return (
        <AFLTeamSelect
          selected={selected}
          requiredAnswers={requiredAnswers}
          onAnswerChange={onAnswerChange}
          {...commonProps}
        />
      );
    case "AFL Players":
      return (
        <AFLPlayerSelect
          selected={selected}
          requiredAnswers={requiredAnswers}
          onAnswerChange={onAnswerChange}
          {...commonProps}
        />
      );
    case "AFL Coaches":
      return (
        <AFLCoachSelect
          selected={selected}
          requiredAnswers={requiredAnswers}
          onAnswerChange={onAnswerChange}
          {...commonProps}
        />
      );
    case "Custom":
      // For custom options list (used for Question 3)
      return (
        <RadioInput
          id={id}
          options={options}
          selected={selected}
          onAnswerChange={onAnswerChange}
          {...commonProps}
        />
      );
    case "Multiple Choice":
      return (
        <MultipleChoiceInput
          id={id}
          options={options}
          selected={selected}
          requiredAnswers={requiredAnswers}
          onAnswerChange={onAnswerChange}
          allSelectedAnswers={getAllSelectedAnswers(id)}
          {...commonProps}
        />
      );
    case "Number":
      return (
        <NumberSelect
          options={options}
          selected={selected}
          onAnswerChange={onAnswerChange}
          {...commonProps}
        />
      );
    case "Free Text":
      return (
        <FreeTextInput
          value={selected[0] || ''}
          onChange={(value) => onAnswerChange([value])}
          {...commonProps}
        />
      );
    default:
      return (
        <RadioInput
          id={id}
          options={options}
          selected={selected}
          onAnswerChange={onAnswerChange}
          {...commonProps}
        />
      );
  }
};
