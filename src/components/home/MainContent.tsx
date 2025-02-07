
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const MainContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 text-center px-4 max-w-4xl mx-auto mt-16 sm:mt-0">
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
  );
};
