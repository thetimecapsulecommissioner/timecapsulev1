
import { toast } from "sonner";
import { UserActivity } from "@/types/UserActivityType";

export const exportActivityCSV = (activities: UserActivity[]) => {
  if (!activities.length) {
    toast.error('No data to export');
    return;
  }

  // Create CSV headers
  const headers = ['ID', 'Event Type', 'User ID', 'User Name', 'Timestamp', 'IP Address', 'User Agent', 'Metadata'];
  
  // Create CSV rows
  const rows = activities.map(activity => [
    activity.id,
    activity.event_type,
    activity.user_id || '',
    activity.display_name || '',
    activity.timestamp,
    activity.ip_address || '',
    activity.user_agent || '',
    JSON.stringify(activity.metadata || {})
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
  link.setAttribute('download', `user_activity_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success('User activity exported successfully');
};
