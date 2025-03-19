
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserActivity } from "@/types/UserActivityType";

export const useUserActivity = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

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
        const userIds = (activityData as any[])
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
          
          // Combine the data
          const formattedData = (activityData as any[]).map(activity => ({
            ...activity,
            display_name: activity.user_id ? userMap.get(activity.user_id) || 'Unknown User' : 'Anonymous'
          })) as UserActivity[];
          
          setActivities(formattedData);
        } else {
          // If there are no user IDs, just add 'Anonymous' as the display name
          setActivities((activityData as any[]).map(activity => ({
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

  return {
    activities,
    loadingActivities,
    fetchUserActivity
  };
};
