import { AFLTeamSelect } from "./AFLTeamSelect";
import { MultipleChoiceInput } from "./MultipleChoiceInput";
import { NumberSelect } from "./NumberSelect";
import { RadioInput } from "./RadioInput";
import { AFLPlayerSelect } from "./AFLPlayerSelect";
import { AFLCoachSelect } from "./AFLCoachSelect";

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
  const commonProps = {
    disabled: disabled
  };

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
    case "Multiple Choice":
      return (
        <MultipleChoiceInput
          id={id}
          options={options}
          selected={selected}
          requiredAnswers={requiredAnswers}
          onAnswerChange={onAnswerChange}
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