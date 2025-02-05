import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileDropdown } from "./ProfileDropdown";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { Logo } from "./navigation/Logo";
import { ScrollArea } from "./ui/scroll-area";

export const Navigation = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-primary z-50 shadow-md">
      <ScrollArea className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center min-w-max">
          <div className="flex items-center gap-4">
            <Logo onClick={handleLogoClick} />
            <NavigationLinks />
          </div>
          
          <div className="flex gap-4 items-center">
            {!isLoading && (
              isLoggedIn ? (
                <ProfileDropdown />
              ) : (
                <>
                  <Button 
                    onClick={() => navigate("/register")}
                    className="bg-secondary hover:bg-secondary-light text-primary px-4 py-2 text-sm rounded-lg transition-all duration-300 animate-slide-up font-bold whitespace-nowrap"
                  >
                    Begin Your Journey
                  </Button>
                  <Button 
                    onClick={() => navigate("/login")}
                    className="bg-secondary hover:bg-secondary-light text-primary px-4 py-2 text-sm rounded-lg transition-all duration-300 animate-slide-up font-bold"
                  >
                    Log in
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};