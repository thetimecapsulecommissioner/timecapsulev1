
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/LoadingState";
import { AdminNav } from "@/components/admin/AdminNav";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw } from "lucide-react";

// Define the UserActivity interface to match the actual data in the user_activity table
type UserActivity = {
  id: string;
  event_type: string;
  user_id: string | null;
  display_name: string | null;
  timestamp: string;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
};

const AdminUserActivity = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Check if user is in administrators table
        const { data: adminData, error: adminError } = await supabase
          .from('administrators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          throw adminError;
        }
        
        setIsAdmin(!!adminData);
        setIsLoading(false);
        
        if (!!adminData) {
          // If admin, fetch activity data
          fetchUserActivity();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const fetchUserActivity = async () => {
    setLoadingActivities(true);
    try {
      // Use the generic query method to fetch from the user_activity table
      // since it's not in the TypeScript definitions
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity' as any)
        .select('*')
        .order('timestamp' as any, { ascending: false })
        .limit(100);
      
      if (activityError) throw activityError;

      if (activityData && activityData.length > 0) {
        // Get user display names for activities with user_ids
        const userIds = activityData
          .filter(activity => activity.user_id)
          .map(activity => activity.user_id);
        
        if (userIds.length > 0) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, display_name')
            .in('id', userIds);
            
          if (profileError) throw profileError;
          
          // Create a mapping of user_id to display_name
          const userMap = new Map();
          profileData?.forEach(profile => {
            userMap.set(profile.id, profile.display_name);
          });
          
          // Combine the data - use type assertion to help TypeScript understand the structure
          const formattedData = activityData.map(activity => ({
            ...activity,
            display_name: activity.user_id ? userMap.get(activity.user_id) || 'Unknown User' : 'Anonymous'
          })) as UserActivity[];
          
          setActivities(formattedData);
        } else {
          // If there are no user IDs, just add 'Anonymous' as the display name
          setActivities(activityData.map(activity => ({
            ...activity,
            display_name: 'Anonymous'
          })) as UserActivity[]);
        }
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
      toast.error('Failed to load user activity data');
    } finally {
      setLoadingActivities(false);
    }
  };

  const exportActivityCSV = () => {
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto my-8 p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Access Denied</h1>
        <p className="text-center mb-6">You don't have permission to view this page.</p>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/dashboard")} className="mr-2">
            Return to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/profile")}>
            Go to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminNav />
      
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Recent user activity tracked in the system (limited to 100)</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchUserActivity}
                disabled={loadingActivities}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingActivities ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportActivityCSV}
                disabled={loadingActivities || !activities.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                    activities.map(activity => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserActivity;
