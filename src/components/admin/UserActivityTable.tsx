
import { useState } from "react";
import { UserActivity } from "@/types/userActivity";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface UserActivityTableProps {
  activities: UserActivity[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const UserActivityTable = ({ activities, isLoading, onRefresh }: UserActivityTableProps) => {
  const [exportLoading, setExportLoading] = useState(false);

  const exportActivityCSV = async () => {
    if (!activities.length) {
      toast.error('No data to export');
      return;
    }
    
    setExportLoading(true);
    try {
      // Create CSV headers
      const headers = [
        'ID', 
        'Event Type', 
        'User ID', 
        'User Name',
        'Timestamp', 
        'IP Address', 
        'Page URL', 
        'Session Duration (s)'
      ];
      
      // Create CSV rows
      const rows = activities.map(activity => [
        activity.id,
        activity.event_type,
        activity.user_id || '',
        activity.display_name || '',
        new Date(activity.timestamp).toISOString(),
        activity.ip_address || '',
        activity.page_url || '',
        activity.session_duration || ''
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `user_activity_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Activity data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportActivityCSV}
          disabled={isLoading || !activities.length || exportLoading}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Page URL</TableHead>
              <TableHead>Session Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
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
              activities.map(activity => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.event_type}</TableCell>
                  <TableCell>{activity.display_name || 'Anonymous'}</TableCell>
                  <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {activity.page_url || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {activity.session_duration ? `${activity.session_duration}s` : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
