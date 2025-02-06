
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SportingClubs = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-8 text-center">Sporting Clubs</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/lovable-uploads/27ba3fc3-f308-4053-a44a-840ea83e01f4.png" 
              alt="Community Sports Event"
              className="w-full h-96 object-cover"
            />
            
            <div className="p-6">
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  The Time Capsule is this year fundraising for and partnering with Community Sporting Clubs. Partnership Opportunities include:
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold mb-2">Community Clubs Fundraising Pool</h3>
                    <p>Join the fundraising pool!</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Club Table at the Fundraiser</h3>
                    <p>Have a group enter and attend this year's event!</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">In-Season Mini Time Capsule Game</h3>
                    <p>A game-week focussed fundraiser</p>
                  </div>
                </div>
                <p className="mt-6">
                  Please reach out in the below contact window if interested in one or all of these options!
                </p>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={() => navigate('/contact')}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg text-lg font-semibold"
                >
                  Contact Us for Partnership
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportingClubs;
