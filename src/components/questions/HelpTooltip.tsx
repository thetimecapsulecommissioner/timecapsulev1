
import { HelpCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface HelpTooltipProps {
  helpText: string;
}

export const HelpTooltip = ({ helpText }: HelpTooltipProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger>
          <HelpCircle className="h-4 w-4 text-primary" />
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-w-lg bg-white p-4">
          <div className="flex justify-end mb-2">
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line">{helpText}</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <HelpCircle className="h-4 w-4 text-primary" />
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        className="bg-white p-3 max-w-[280px] text-sm whitespace-pre-line"
        sideOffset={5}
        align="start"
      >
        <p className="text-gray-700">{helpText}</p>
      </TooltipContent>
    </Tooltip>
  );
};
