import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-primary">
      <Navigation />
      
      {/* Main content with padding to account for fixed menubar */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6 text-center">
          The Time Capsule
        </h1>
        <p className="text-xl md:text-2xl text-secondary/90 max-w-2xl text-center mb-8">
          Make your predictions about the future and seal them The Time Capsule. 
          Gather later with your community to crown your Time Capsule winner and help raise funds and awareness for community sport!
        </p>
        <Button 
          onClick={() => navigate("/about")}
          className="bg-secondary hover:bg-secondary-light text-primary px-8 py-6 text-lg rounded-lg transition-all duration-300 animate-slide-up font-bold mt-4"
        >
          The Time Capsule Explained
        </Button>
      </div>
    </div>
  );
};