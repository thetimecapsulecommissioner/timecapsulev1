
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { exportActivityCSV } from "@/utils/exportCSV";
import { UserActivity } from "@/types/UserActivityType";

interface UserActivityHeaderProps {
  activities: UserActivity[];
  loadingActivities: boolean;
  onRefresh: () => void;
}

export const UserActivityHeader = ({ 
  activities, 
  loadingActivities, 
  onRefresh 
}: UserActivityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>Recent user activity tracked in the system (limited to 100)</CardDescription>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={loadingActivities}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loadingActivities ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => exportActivityCSV(activities)}
          disabled={loadingActivities || !activities.length}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};
