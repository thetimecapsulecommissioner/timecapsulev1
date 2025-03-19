
import {
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { UserActivity } from "@/types/UserActivityType";

interface UserActivityTableProps {
  activities: UserActivity[];
  loadingActivities: boolean;
}

export const UserActivityTable = ({ activities, loadingActivities }: UserActivityTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Type</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Metadata</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingActivities ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                Loading activity data...
              </TableCell>
            </TableRow>
          ) : activities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No activity data found
              </TableCell>
            </TableRow>
          ) : (
            activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.event_type}</TableCell>
                <TableCell>{activity.display_name}</TableCell>
                <TableCell>
                  {new Date(activity.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{activity.ip_address || 'Unknown'}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {activity.metadata ? JSON.stringify(activity.metadata) : 'No metadata'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
