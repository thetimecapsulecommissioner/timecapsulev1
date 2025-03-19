
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminUserActivity = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      const { data, error } = await supabase
        .from('user_activity')
        .select(`
          id,
          event_type,
          user_id,
          timestamp,
          page_url,
          session_duration,
          metadata,
          profiles(email, first_name, last_name)
        `)
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setUserActivity(data || []);
    } catch (error) {
      console.error('Error fetching user activity:', error);
      toast.error("Error loading user activity data");
    } finally {
      setIsLoading(false);
    }
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
        
        <div className="bg-primary/10 rounded-lg p-4 md:p-6">
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
                  {userActivity.map((activity) => (
                    <tr key={activity.id} className="border-b border-gray-200">
                      <td className="px-4 py-2">
                        {new Date(activity.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {activity.profiles ? 
                          `${activity.profiles.first_name} ${activity.profiles.last_name}` : 
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
        </div>
      </div>
    </div>
  );
};

export default AdminUserActivity;
