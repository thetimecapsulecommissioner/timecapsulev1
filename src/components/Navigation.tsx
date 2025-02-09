
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileDropdown } from "./ProfileDropdown";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { Logo } from "./navigation/Logo";
import { ScrollArea } from "./ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

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

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-primary z-50 shadow-md h-16 flex items-center px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-primary p-0">
            <div className="flex flex-col h-full">
              <div className="p-4">
                <Logo onClick={handleLogoClick} />
              </div>
              <div className="flex-1 overflow-auto">
                <NavigationLinks />
              </div>
              {!isLoading && (
                <div className="p-4">
                  {isLoggedIn ? (
                    <ProfileDropdown />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/register");
                        }}
                        className="bg-secondary hover:bg-secondary-light text-primary px-3 py-1.5 text-sm rounded-lg transition-all duration-300 animate-slide-up font-bold whitespace-nowrap w-full"
                      >
                        Sign-Up
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/login");
                        }}
                        className="bg-secondary hover:bg-secondary-light text-primary px-3 py-1.5 text-sm rounded-lg transition-all duration-300 animate-slide-up font-bold w-full"
                      >
                        Log in
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex-1 flex justify-center items-center">
          <Logo onClick={handleLogoClick} />
        </div>
        {isLoggedIn && (
          <div className="flex items-center">
            <ProfileDropdown />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-primary z-50 shadow-md">
      <ScrollArea className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center min-w-max">
          <div className="flex items-center gap-4">
            <Logo onClick={handleLogoClick} />
            <NavigationLinks />
          </div>
          
          <div className="flex gap-2 items-center">
            {!isLoading && (
              isLoggedIn ? (
                <ProfileDropdown />
              ) : (
                <div className="flex gap-2 flex-wrap justify-end">
                  <Button 
                    onClick={() => navigate("/register")}
                    className="bg-secondary hover:bg-secondary-light text-primary px-3 py-1.5 text-sm rounded-lg transition-all duration-300 animate-slide-up font-bold whitespace-nowrap"
                  >
                    Sign-Up
                  </Button>
                  <Button 
                    onClick={() => navigate("/login")}
                    className="bg-secondary hover:bg-secondary-light text-primary px-3 py-1.5 text-sm rounded-lg transition-all duration-300 animate-slide-up font-bold"
                  >
                    Log in
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export { Navigation };
