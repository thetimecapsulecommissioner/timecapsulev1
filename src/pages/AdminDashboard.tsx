
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  const isCompetitionsPage = location.pathname === '/admin/competitions';
  const isAdministratorsPage = location.pathname === '/admin/administrators';
  const isTemplatesPage = location.pathname === '/admin/templates';
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-32">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
          Admin Dashboard
        </h1>
        
        <div className="flex gap-4 mb-6">
          <Button 
            variant={!isCompetitionsPage && !isAdministratorsPage && !isTemplatesPage ? "default" : "outline"}
            onClick={() => navigate('/admin')}
          >
            Overview
          </Button>
          <Button 
            variant={isCompetitionsPage ? "default" : "outline"}
            onClick={() => navigate('/admin/competitions')}
          >
            Competitions
          </Button>
          <Button 
            variant={isTemplatesPage ? "default" : "outline"}
            onClick={() => navigate('/admin/templates')}
          >
            Templates
          </Button>
          <Button 
            variant={isAdministratorsPage ? "default" : "outline"}
            onClick={() => navigate('/admin/administrators')}
          >
            Administrators
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin/user-activity')}
          >
            User Activity
          </Button>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-4 md:p-6">
          {isCompetitionsPage ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Competitions</h2>
              <p className="text-gray-500">Competition management functionality will be implemented here.</p>
            </div>
          ) : isTemplatesPage ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Templates</h2>
              <p className="text-gray-500">Template management functionality will be implemented here.</p>
            </div>
          ) : isAdministratorsPage ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Administrators</h2>
              <p className="text-gray-500">Administrator management functionality will be implemented here.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Admin Overview</h2>
              <p className="text-gray-500">Welcome to the admin dashboard. Use the navigation above to manage different aspects of the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

