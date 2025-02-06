
import { HelpTooltip } from "./HelpTooltip";
import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface QuestionHeaderProps {
  question: string;
  helpText?: string;
  points?: number;
}

export const QuestionHeader = ({ question, helpText, points }: QuestionHeaderProps) => {
  const isMobile = useIsMobile();

  const PointsDisplay = () => {
    if (!points) return null;

    const tooltipContent = `${points} Points`;

    if (isMobile) {
      return (
        <Dialog>
          <DialogTrigger>
            <div className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
              <Star className="h-3 w-3" />
            </div>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-lg bg-white p-4">
            <div className="flex justify-end mb-2">
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer" />
            </div>
            <p className="text-sm text-gray-700">{tooltipContent}</p>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger>
          <div className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
            <Star className="h-3 w-3" />
          </div>
        </TooltipTrigger>
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
      <div className="flex flex-col items-end space-y-2 ml-2">
        {helpText && <HelpTooltip helpText={helpText} />}
        <PointsDisplay />
      </div>
    </div>
  );
};
