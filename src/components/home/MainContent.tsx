import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const MainContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 text-center pr-8">
      <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6">
        The Time Capsule
      </h1>
      <p className="text-xl md:text-2xl text-secondary/90 max-w-2xl mx-auto mb-8">
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
  );
};