import { HelpTooltip } from "./HelpTooltip";
import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuestionHeaderProps {
  question: string;
  helpText?: string;
  points?: number;
}

export const QuestionHeader = ({ question, helpText, points }: QuestionHeaderProps) => {
  const isMobile = useIsMobile();

  const PointsDisplay = () => {
    if (isMobile) {
      return (
        <Dialog>
          <DialogTrigger>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span className="text-xs">{points}</span>
            </div>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-lg bg-white p-4">
            <p className="text-sm text-gray-700">Points available: {points}</p>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span className="text-xs">{points}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white p-2">
          <p className="text-sm text-gray-700">Points available: {points}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
      </div>
      <div className="flex flex-col items-end gap-2">
        {helpText && <HelpTooltip helpText={helpText} />}
        {points && <PointsDisplay />}
      </div>
    </div>
  );
};