import { Navigation } from "./Navigation";
import { MainContent } from "./home/MainContent";
import { ActionButtons } from "./home/ActionButtons";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-primary">
      <Navigation />
      
      <div className="flex flex-row items-center justify-center min-h-screen px-4 w-full max-w-7xl mx-auto animate-fade-in">
        <MainContent />
        <ActionButtons />
      </div>
    </div>
  );
};