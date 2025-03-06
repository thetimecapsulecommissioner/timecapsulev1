
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/LoadingState";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminNav } from "@/components/admin/AdminNav";

const AdminDashboard = () => {
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
          .select('*')
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto my-8 p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Access Denied</h1>
        <p className="text-center">You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminNav />
      
      <div className="mt-8">
        <AdminDataTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
