import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const NavigationLinks = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <nav className="flex gap-6 ml-5">
      <button 
        onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        Home
      </button>
      <button 
        onClick={() => navigate("/about")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        About
      </button>
      <button 
        onClick={() => navigate("/leaderboard")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        Leaderboard
      </button>
      <button 
        onClick={() => navigate("/community-groups")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        Community Groups
      </button>
      <button 
        onClick={() => navigate("/contact")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        Contact
      </button>
    </nav>
  );
};