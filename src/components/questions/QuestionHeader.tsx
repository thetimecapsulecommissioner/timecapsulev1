import { HelpTooltip } from "./HelpTooltip";

interface QuestionHeaderProps {
  question: string;
  helpText?: string;
  points?: number;
  questionId?: number;
}

export const QuestionHeader = ({ question, helpText, points, questionId }: QuestionHeaderProps) => {
  const shouldShowHelp = questionId !== 2 && helpText;

  return (
    <div className="flex items-start mb-4">
      <h3 className="text-xl font-semibold text-gray-700 flex-grow">{question}</h3>
      <div className="flex items-start space-x-2 ml-2 flex-shrink-0">
        {shouldShowHelp && <HelpTooltip helpText={helpText} />}
        {points !== undefined && (
          <span className="text-sm font-medium text-gray-600">
            {points} Points
          </span>
        )}
      </div>
    </div>
  );
};