
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CountdownButtonProps {
  label: string;
  isOpen: boolean;
  timeLeft: string;
  onClick?: () => void;
  disabled?: boolean;
  isSubmitted?: boolean;
  isExpired?: boolean;
}

export const CountdownButton = ({
  label,
  isOpen,
  timeLeft,
  onClick,
  disabled = false,
  isSubmitted = false,
  isExpired = false
}: CountdownButtonProps) => {
  const getBackgroundColor = () => {
    if (disabled) return "bg-gray-100 text-gray-500";
    if (isExpired) return "bg-green-100 hover:bg-green-200";
    if (isSubmitted) return "bg-green-100 hover:bg-green-200";
    if (isOpen) return "bg-yellow-100 hover:bg-yellow-200";
    return "bg-red-100 hover:bg-red-200";
  };

  const getStatusText = () => {
    if (disabled) return "Coming Soon";
    if (isExpired) return "Closed";
    if (isSubmitted) return "Submitted";
    if (isOpen) return "Open";
    return "Not Started";
  };

  return (
    <Button
      className={cn(
        "w-full p-4 h-auto flex flex-col items-center border-0 justify-between rounded-lg transition-all duration-200",
        getBackgroundColor()
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex flex-col sm:flex-row w-full items-center sm:justify-between gap-2">
        <span className="text-lg font-semibold">{label}</span>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="bg-white/50 px-2 py-1 rounded text-sm">
            {getStatusText()}
          </span>
          <span className="bg-white/50 px-2 py-1 rounded text-sm">
            {timeLeft}
          </span>
        </div>
      </div>
    </Button>
  );
};
