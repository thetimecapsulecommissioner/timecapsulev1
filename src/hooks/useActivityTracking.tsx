
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ActivityEventType } from '@/types/userActivity';

export const useActivityTracking = () => {
  const location = useLocation();
  
  // Track page views
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('user_activity').insert({
          event_type: 'page_view',
          user_id: user?.id || null,
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          ip_address: null, // Client can't reliably determine IP
          metadata: { 
            referrer: document.referrer,
            screen_size: `${window.innerWidth}x${window.innerHeight}`
          }
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);

  // Function to track specific events
  const trackEvent = useCallback(async (
    eventType: ActivityEventType, 
    metadata: Record<string, any> = {}
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('user_activity').insert({
        event_type: eventType,
        user_id: user?.id || null,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        metadata
      });
    } catch (error) {
      console.error(`Error tracking ${eventType}:`, error);
    }
  }, []);

  return { trackEvent };
};
