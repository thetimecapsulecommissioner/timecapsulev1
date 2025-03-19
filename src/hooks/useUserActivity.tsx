
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserActivity } from '@/types/userActivity';
import { toast } from 'sonner';

export const useUserActivity = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch activities with user profile information
      const { data: activityData, error } = await supabase
        .from('user_activity')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;

      if (!activityData || activityData.length === 0) {
        setActivities([]);
        setIsLoading(false);
        return;
      }

      // Get all user IDs that have activity
      const userIds = activityData
        .map(activity => activity.user_id)
        .filter(id => id !== null) as string[];
      
      // Fetch profile data for those users if there are any
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
        const activitiesWithProfiles = activityData.map(activity => ({
          ...activity,
          display_name: activity.user_id ? userMap.get(activity.user_id) || 'Unknown' : 'Anonymous'
        }));
        
        setActivities(activitiesWithProfiles as UserActivity[]);
      } else {
        // No user IDs in activity data, just use the data as is
        setActivities(activityData as UserActivity[]);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
      toast.error('Failed to load user activity data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    fetchActivities
  };
};
