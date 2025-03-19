
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useActivityTracking } from "./useActivityTracking";

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { trackEvent } = useActivityTracking();

  useEffect(() => {
    const checkAndRestoreSession = async () => {
      try {
        console.log('Checking auth session state...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          throw error;
        }
        
        if (!session) {
          console.log('No auth session found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Auth session found:', {
          userId: session.user?.id,
          email: session.user?.email
        });
        
        // Track successful session restoration
        trackEvent('login_success', {
          method: 'session_restored',
          userId: session.user?.id,
        });
        
        setIsAuthChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error("Authentication error. Please try logging in again.");
        navigate('/login');
      }
    };

    checkAndRestoreSession();
  }, [navigate, trackEvent]);

  return { isAuthChecking };
};
