
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Check if user is in administrators table using our new function
        const { data, error } = await supabase.rpc('is_admin', {
          user_uuid: user.id
        });

        if (error) {
          console.error('Error checking admin status:', error);
          throw error;
        }
        
        setIsAdmin(!!data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, isLoading };
};
