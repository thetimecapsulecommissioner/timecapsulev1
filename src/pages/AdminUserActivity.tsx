
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TimeFrame, processActivityData } from "@/utils/activityChartUtils"; 
import { ActivityChartContainer } from "@/components/admin/ActivityChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

const AdminUserActivity = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<TimeFrame>("24hours");
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date } | undefined>(undefined);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          return;
        }
        
        // Check if user is an admin
        const { data, error } = await supabase.rpc('is_admin', {
          user_uuid: user.id
        });
        
        if (error) throw error;
        setIsAdmin(data);
        
        if (!data) {
          toast.error("You don't have admin privileges");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        toast.error("Error checking admin status");
        navigate('/dashboard');
      }
    };
    
    checkAdminStatus();
  }, [navigate]);
  
  useEffect(() => {
    if (isAdmin) {
      fetchUserActivity();
    }
  }, [isAdmin]);
  
  const fetchUserActivity = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all user activity data for analysis
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (activityError) throw activityError;
      
      // If we have user IDs, fetch corresponding profile information separately
      const userIds = activityData
        .filter(item => item.user_id)
        .map(item => item.user_id);
      
      let profilesMap = {};
      
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', userIds);
        
        if (profilesError) throw profilesError;
        
        // Create a map of user_id to profile data
        profilesMap = profilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
      }
      
      // Combine activity data with profile information
      const combinedData = activityData.map(activity => ({
        ...activity,
        profile: activity.user_id ? profilesMap[activity.user_id] : null
      }));
      
      setUserActivity(combinedData);
    } catch (error) {
      console.error('Error fetching user activity:', error);
      toast.error("Error loading user activity data");
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = processActivityData(userActivity, timeframe, customRange);
  
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as TimeFrame);
  };
  
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  
  if (isAdmin === false) {
    return null; // Will be redirected by the useEffect
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-32">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary">
            User Activity
          </h1>
          <Button onClick={() => navigate('/admin')}>
            Back to Admin
          </Button>
        </div>
        
        {/* Charts Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Activity Analytics</h2>
            <div className="w-40">
              <Select value={timeframe} onValueChange={handleTimeframeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Last 24 Hours</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Activity Charts */}
          <ActivityChartContainer metrics={metrics} />
        </div>
        
        {/* Activity Table */}
        <Card className="bg-primary/10 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">Raw Activity Data</h2>
          {isLoading ? (
            <p className="text-center text-gray-500">Loading user activity...</p>
          ) : userActivity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary/20">
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Event</th>
                    <th className="px-4 py-2 text-left">Page</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {userActivity.slice(0, 100).map((activity) => (
                    <tr key={activity.id} className="border-b border-gray-200">
                      <td className="px-4 py-2">
                        {new Date(activity.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {activity.profile ? 
                          `${activity.profile.first_name || ''} ${activity.profile.last_name || ''}` : 
                          'Guest'}
                      </td>
                      <td className="px-4 py-2">{activity.event_type}</td>
                      <td className="px-4 py-2">{activity.page_url}</td>
                      <td className="px-4 py-2">
                        {activity.session_duration ? 
                          `${Math.floor(activity.session_duration / 60)}m ${activity.session_duration % 60}s` : 
                          '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No user activity data available.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminUserActivity;
