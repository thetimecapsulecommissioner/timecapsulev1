
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
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

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error logging out");
        return;
      }
      toast.success("Logged out successfully");
      window.location.href = '/';
    } catch (error) {
      toast.error("Error logging out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isLoading} className="bg-green-500 rounded-full">
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={avatarUrl || undefined}
            alt="Profile"
            className="h-full w-full object-cover"
          />
          <AvatarFallback className="bg-green-500">
            <img 
              src="/lovable-uploads/63e27305-cd9e-415f-a09a-47b02355d6e0.png" 
              alt="Default Avatar" 
              className="h-full w-full object-cover"
            />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-green-500 text-white border-none shadow-lg">
        <DropdownMenuItem 
          onClick={() => navigate("/profile")}
          className="hover:bg-green-600 cursor-pointer"
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate("/competitions")}
          className="hover:bg-green-600 cursor-pointer"
        >
          My Competitions
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-green-600" />
        <DropdownMenuItem 
          onClick={handleLogout} 
          disabled={isLoading}
          className="hover:bg-green-600 cursor-pointer"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

