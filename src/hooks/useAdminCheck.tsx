
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
