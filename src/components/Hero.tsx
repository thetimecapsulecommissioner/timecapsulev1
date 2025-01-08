import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-fade-in bg-primary">
      <div className="mb-8">
        <img 
          src="/lovable-uploads/1db7c607-3782-4cdd-9bc6-253bd55f6e86.png" 
          alt="Time Capsule Logo" 
          className="w-48 h-48 object-contain mb-4"
        />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6 text-center">
        Time Capsule
      </h1>
      <p className="text-xl md:text-2xl text-secondary/90 max-w-2xl text-center mb-8">
        Make your predictions about the future and seal them in our digital time capsule. 
        Return later to see how accurate you were!
      </p>
      <Button 
        onClick={() => navigate("/register")}
        className="bg-secondary hover:bg-secondary-light text-primary px-8 py-6 text-lg rounded-lg transition-all duration-300 animate-slide-up font-bold"
      >
        Begin Your Journey
      </Button>
    </div>
  );
};