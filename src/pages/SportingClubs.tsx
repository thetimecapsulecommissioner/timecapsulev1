
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AboutSection } from "@/components/about/AboutSection";

const SportingClubs = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-12 text-center">Sporting Clubs</h1>
          
          <AboutSection
            title="Community Clubs Fundraising Pool"
            content="Join the fundraising pool! The Time Capsule is this year fundraising for and partnering with Community Sporting Clubs. Be part of our growing community of sports organizations making a difference."
            imagePosition="right"
            imageSrc="/lovable-uploads/42fc1dc7-689f-44cd-ae5b-e0c872c19f05.png"
          />

          <AboutSection
            title="Club Table at the Fundraiser"
            content="Have a group enter and attend this year's event! Get your club involved in our Brownlow-Style awards night where we unveil the Time Capsule predictions and celebrate together as a community."
            imagePosition="left"
            imageSrc="/lovable-uploads/999e73b8-e398-423e-a605-8db02a8c06ce.png"
          />

          <AboutSection
            title="In-Season Mini Time Capsule Game"
            content="A game-week focussed fundraiser designed specifically for sporting clubs. Engage your members and supporters while raising funds for your club through an exciting prediction-based competition."
            imagePosition="right"
            imageSrc="/lovable-uploads/5ae6d24f-0cb4-4c0e-a6dd-aead3ccbc2bb.png"
          />

          <div className="mt-12 text-center">
            <Button 
              onClick={() => navigate('/contact')}
              className="bg-secondary hover:bg-secondary-light text-primary px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Contact Us for Partnership
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportingClubs;
