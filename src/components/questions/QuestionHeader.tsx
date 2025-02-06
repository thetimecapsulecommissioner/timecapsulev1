import { HelpTooltip } from "./HelpTooltip";
import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface QuestionHeaderProps {
  question: string;
  helpText?: string;
  points?: number;
}

export const QuestionHeader = ({ question, helpText, points }: QuestionHeaderProps) => {
  const isMobile = useIsMobile();

  const PointsDisplay = () => {
    if (!points) return null;

    const content = (
      <div className="flex items-center space-x-1">
        <div className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
          <Star className="h-3 w-3" />
        </div>
      </div>
    );

    const tooltipContent = `${points} Points`;

    if (isMobile) {
      return (
        <Dialog>
          <DialogTrigger>{content}</DialogTrigger>
          <DialogContent className="w-[90vw] max-w-lg bg-white p-4">
            <p className="text-sm text-gray-700">{tooltipContent}</p>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger>{content}</TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-white p-3"
          sideOffset={5}
        >
          <p className="text-sm text-gray-700">{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex items-start mb-4">
      <h3 className="text-xl font-semibold text-gray-700 flex-grow">{question}</h3>
      <div className="flex items-start space-x-2 ml-2 flex-shrink-0">
        {helpText && <HelpTooltip helpText={helpText} />}
        <PointsDisplay />
      </div>
    </div>
  );
};