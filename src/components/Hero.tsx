import { Navigation } from "./Navigation";
import { MainContent } from "./home/MainContent";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-primary">
      <Navigation />
      
      <div className="flex flex-col items-center justify-center flex-1 px-4 w-full max-w-7xl mx-auto animate-fade-in">
        {isMobile && (
          <div className="w-full px-4 mb-8 flex flex-col gap-4">
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
        )}
        <MainContent />
      </div>
    </div>
  );
};
