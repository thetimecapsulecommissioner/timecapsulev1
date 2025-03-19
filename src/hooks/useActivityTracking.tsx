
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useActivityTracking = () => {
  const location = useLocation();
  const [pageVisitStartTime, setPageVisitStartTime] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get the current user's ID on mount
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    getUserId();
  }, []);

  // Track page visits
  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        // Record the start time when a user visits a page
        const startTime = Date.now();
        setPageVisitStartTime(startTime);
        
        // Log the page visit
        await supabase.from('user_activity').insert({
          event_type: 'page_visit',
          user_id: userId,
          page_url: location.pathname,
          metadata: { path: location.pathname, search: location.search }
        });
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    };
    
    trackPageVisit();
    
    // Clean up function to record session duration when unmounting
    return () => {
      if (pageVisitStartTime) {
        const duration = Math.floor((Date.now() - pageVisitStartTime) / 1000); // Duration in seconds
        
        // Only track durations that make sense (more than 1 second, less than 1 hour)
        if (duration > 1 && duration < 3600) {
          // Fix: Use async IIFE instead of .then().catch()
          (async () => {
            try {
              await supabase.from('user_activity').insert({
                event_type: 'page_exit',
                user_id: userId,
                page_url: location.pathname,
                session_duration: duration,
                metadata: { path: location.pathname, duration }
              });
            } catch (error) {
              console.error('Error tracking page exit:', error);
            }
          })();
        }
      }
    };
  }, [location.pathname, userId]);

  // Utility function to track specific events
  const trackEvent = async (eventType: string, metadata: any = {}) => {
    try {
      await supabase.from('user_activity').insert({
        event_type: eventType,
        user_id: userId,
        page_url: location.pathname,
        metadata
      });
    } catch (error) {
      console.error(`Error tracking ${eventType}:`, error);
    }
  };

  return { trackEvent };
};
