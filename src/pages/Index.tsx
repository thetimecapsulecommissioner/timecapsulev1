
import { Hero } from "@/components/Hero";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen pt-16">
        <div className="flex justify-center gap-4 p-4 bg-primary">
          <Button 
            onClick={() => navigate("/register")}
            className="bg-secondary hover:bg-secondary-light text-primary px-4 py-2 text-sm rounded-lg transition-all duration-300 font-bold whitespace-nowrap"
          >
            Begin Journey
          </Button>
          <Button 
            onClick={() => navigate("/login")}
            className="bg-secondary hover:bg-secondary-light text-primary px-4 py-2 text-sm rounded-lg transition-all duration-300 font-bold"
          >
            Log in
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-secondary mb-6">
            The Time Capsule
          </h1>
          <p className="text-lg text-secondary/90 mb-8 text-center">
            Make your predictions about the future and seal them in The Time Capsule. 
            Gather later with your community to crown your Time Capsule winner and help raise funds and awareness for community sport!
          </p>
          <Button 
            onClick={() => navigate("/about")}
            className="bg-secondary hover:bg-secondary-light text-primary px-6 py-4 text-lg rounded-lg transition-all duration-300 animate-slide-up font-bold"
          >
            The Time Capsule Explained
          </Button>
        </div>
      </div>
    );
  }

  return <Hero />;
};

export default Index;
