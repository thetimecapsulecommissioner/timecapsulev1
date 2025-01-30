import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  helpText: string;
}

export const HelpTooltip = ({ helpText }: HelpTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-5 w-5 text-gray-500" />
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white p-4 max-w-sm whitespace-pre-line">
          <p className="text-gray-700">{helpText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};