import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  helpText: string;
}

export const HelpTooltip = ({ helpText }: HelpTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        className="bg-white p-3 sm:p-4 max-w-[280px] sm:max-w-sm text-sm sm:text-base whitespace-pre-line"
        sideOffset={5}
        align="start"
      >
        <p className="text-gray-700">{helpText}</p>
      </TooltipContent>
    </Tooltip>
  );
};