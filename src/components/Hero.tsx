import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 text-center">
        Time Capsule
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 max-w-2xl text-center mb-8">
        Make your predictions about the future and seal them in our digital time capsule. 
        Return later to see how accurate you were!
      </p>
      <Button 
        onClick={() => navigate("/register")}
        className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 animate-slide-up"
      >
        Begin Your Journey
      </Button>
    </div>
  );
};