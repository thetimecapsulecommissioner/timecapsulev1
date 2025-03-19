import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useActivityTracking } from "@/hooks/useActivityTracking";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { trackEvent } = useActivityTracking();

  useEffect(() => {
    getProfile();
    checkAdminStatus();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data?.avatar_url) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(data.avatar_url);
          setAvatarUrl(publicUrl);
        }
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found");
        setIsAdmin(false);
        return;
      }

      console.log("Checking admin status for user ID:", user.id);

      // Check if user is in administrators table
      const { data, error } = await supabase
        .from('administrators')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        throw error;
      }

      console.log("Admin check result:", data);
      
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      navigate('/'); // Navigate to home page first
      
      // Track logout event before signing out
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await trackEvent('logout', { userId: user.id });
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error logging out");
        return;
      }
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isLoading}>
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={avatarUrl || undefined}
            alt="Profile"
            className="h-full w-full object-cover"
          />
          <AvatarFallback>
            <img 
              src="/lovable-uploads/63e27305-cd9e-415f-a09a-47b02355d6e0.png" 
              alt="Default Avatar" 
              className="h-full w-full object-cover"
            />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg rounded-md">
        <DropdownMenuItem onClick={() => navigate("/profile")} className="text-green-600 hover:bg-gray-100">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/competitions")} className="text-green-600 hover:bg-gray-100">
          My Competitions
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin")} className="text-green-600 hover:bg-gray-100">
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem onClick={handleLogout} disabled={isLoading} className="text-green-600 hover:bg-gray-100">
          {isLoading ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
