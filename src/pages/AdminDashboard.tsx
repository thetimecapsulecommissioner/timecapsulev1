
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/LoadingState";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminNav } from "@/components/admin/AdminNav";
import { useLocation, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log("Checking admin status for user:", user.id);

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

        console.log("Admin data:", adminData);
        
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

  const fetchAdministrators = async () => {
    setLoadingAdmins(true);
    try {
      // Fetch administrators with their profile information
      const { data: adminData, error: adminError } = await supabase
        .from('administrators')
        .select('*');
      
      if (adminError) throw adminError;

      // Get the user profiles for these admins
      if (adminData && adminData.length > 0) {
        const userIds = adminData.map(admin => admin.user_id);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, display_name, email')
          .in('id', userIds);
          
        if (profileError) throw profileError;
        
        // Combine admin data with profile data
        const adminsWithProfiles = adminData.map(admin => {
          const profile = profileData?.find(p => p.id === admin.user_id);
          return {
            ...admin,
            display_name: profile?.display_name || 'Unknown',
            email: profile?.email || 'Unknown'
          };
        });
        
        setAdmins(adminsWithProfiles);
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching administrators:', error);
      toast.error('Failed to load administrators');
    } finally {
      setLoadingAdmins(false);
    }
  };

  const addCommissionerAsAdmin = async () => {
    setAddingAdmin(true);
    try {
      // Find the user with display_name "The Commissioner"
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('display_name', 'The Commissioner')
        .single();
      
      if (profileError) {
        console.error('Error finding user:', profileError);
        toast.error('Could not find user "The Commissioner"');
        return;
      }
      
      if (!profileData) {
        toast.error('User "The Commissioner" not found');
        return;
      }
      
      // Check if this user is already an admin
      const { data: existingAdmin, error: checkError } = await supabase
        .from('administrators')
        .select('id')
        .eq('user_id', profileData.id)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking admin status:', checkError);
        throw checkError;
      }
      
      if (existingAdmin) {
        toast.info('User "The Commissioner" is already an administrator');
        return;
      }
      
      // Add the user as an admin
      const { error: insertError } = await supabase
        .from('administrators')
        .insert({ user_id: profileData.id });
        
      if (insertError) {
        console.error('Error adding admin:', insertError);
        throw insertError;
      }
      
      toast.success('Successfully added "The Commissioner" as administrator');
      
      // Refresh the admin list
      fetchAdministrators();
      
    } catch (error) {
      console.error('Error adding administrator:', error);
      toast.error('Failed to add administrator');
    } finally {
      setAddingAdmin(false);
    }
  };

  // Fetch administrators when navigating to the administrators page
  useEffect(() => {
    if (currentPath === "/admin/administrators" && isAdmin) {
      fetchAdministrators();
    }
  }, [currentPath, isAdmin]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto my-8 p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Access Denied</h1>
        <p className="text-center mb-6">You don't have permission to view this page.</p>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/dashboard")} className="mr-2">
            Return to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/profile")}>
            Go to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminNav />
      
      {currentPath === "/admin/administrators" ? (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Administrators</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchAdministrators}
                disabled={loadingAdmins}
              >
                Refresh List
              </Button>
              <Button 
                onClick={addCommissionerAsAdmin}
                disabled={addingAdmin}
              >
                Add "The Commissioner" as Admin
              </Button>
            </div>
          </div>
          
          {loadingAdmins ? (
            <div className="flex justify-center my-12">
              <LoadingState />
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">User ID</th>
                    <th className="p-3 text-left">Display Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center p-6">No administrators found</td>
                    </tr>
                  ) : (
                    admins.map(admin => (
                      <tr key={admin.id} className="border-t border-border">
                        <td className="p-3 truncate max-w-[150px]">{admin.user_id}</td>
                        <td className="p-3">{admin.display_name}</td>
                        <td className="p-3">{admin.email}</td>
                        <td className="p-3">
                          {new Date(admin.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <AdminDataTable />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
