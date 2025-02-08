
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ActionButtons } from "./ActionButtons";
import { useIsMobile } from "@/hooks/use-mobile";

export const MainContent = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 text-center sm:text-left sm:w-2/3">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-secondary mb-6">
            The Time Capsule
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-secondary/90 mb-8">
            Make your predictions about the future and seal them in The Time Capsule. 
            Gather later with your community to crown your Time Capsule winner and help raise funds and awareness for community sport!
          </p>
          <Button 
            onClick={() => navigate("/about")}
            className="bg-secondary hover:bg-secondary-light text-primary px-6 py-4 text-lg rounded-lg transition-all duration-300 animate-slide-up font-bold mt-4"
          >
            The Time Capsule Explained
          </Button>
        </div>
        {!isMobile && (
          <div className="sm:w-1/3 flex items-center">
            <ActionButtons />
          </div>
        )}
      </div>
    </div>
  );
};
