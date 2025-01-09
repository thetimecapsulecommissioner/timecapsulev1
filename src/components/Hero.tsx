import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-primary">
      {/* Fixed menubar */}
      <div className="fixed top-0 left-0 right-0 bg-primary z-50 shadow-md">
        <div className="container mx-auto px-4 py-1 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/3b3da353-b5c7-4a52-ac15-a9833289a7f1.png" 
              alt="Time Capsule Logo" 
              className="w-20 h-20 object-contain"
            />
            <nav className="flex gap-6 ml-10">
              <button 
                onClick={() => navigate("/")} 
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
                onClick={() => navigate("/leaderboards")} 
                className="text-secondary hover:text-secondary-light transition-colors"
              >
                Leaderboards
              </button>
              <button 
                onClick={() => navigate("/register")} 
                className="text-secondary hover:text-secondary-light transition-colors"
              >
                Start my own
              </button>
              <button 
                onClick={() => navigate("/contact")} 
                className="text-secondary hover:text-secondary-light transition-colors"
              >
                Contact
              </button>
            </nav>
          </div>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-secondary hover:bg-secondary-light text-primary px-8 py-6 text-lg rounded-lg transition-all duration-300 animate-slide-up font-bold"
          >
            Begin Your Journey
          </Button>
        </div>
      </div>

      {/* Main content with padding to account for fixed menubar */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6 text-center">
          The Time Capsule
        </h1>
        <p className="text-xl md:text-2xl text-secondary/90 max-w-2xl text-center mb-8">
          Make your predictions about the future and seal them in our digital time capsule. 
          Gather later with your community to countdown and crown your Time Capsule winner!
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