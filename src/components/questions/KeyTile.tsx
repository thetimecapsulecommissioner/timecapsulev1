import { Card } from "@/components/ui/card";
import { HelpCircle, MessageSquare, Star } from "lucide-react";

interface KeyTileProps {
  className?: string;
}

export const KeyTile = ({ className = "" }: KeyTileProps) => {
  return (
    <Card className={`p-6 bg-mystical-100 shadow-lg ${className}`}>
      <h3 className="text-xl font-semibold text-primary mb-4">Question Key</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-700">
            Hover or click over this icon to get specific rules, definitions, explanations and information relating to questions
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mt-1">
            <Star className="h-3 w-3" />
          </div>
          <p className="text-sm text-gray-700">
            This is the number of points available for each response you give to a question
          </p>
        </div>
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-700">
            This is just any thought, joke or feedback you want to give about your response that might be included in the end of season event!
          </p>
        </div>
      </div>
    </Card>
  );
};