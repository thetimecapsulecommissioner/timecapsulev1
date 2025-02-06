
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export const NavigationLinks = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useIsMobile();

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
  
  const buttonClass = isMobile 
    ? "text-secondary hover:text-secondary-light transition-colors text-sm w-full text-left py-2"
    : "text-secondary hover:text-secondary-light transition-colors";

  return (
    <nav className={`flex ${isMobile ? 'flex-col' : 'gap-6 ml-5'}`}>
      <button 
        onClick={() => navigate("/about")} 
        className={buttonClass}
      >
        About
      </button>
      <button 
        onClick={() => navigate("/sporting-clubs")} 
        className={buttonClass}
      >
        Sporting Clubs
      </button>
      <button 
        onClick={() => navigate("/contact")} 
        className={buttonClass}
      >
        Contact
      </button>
    </nav>
  );
};
