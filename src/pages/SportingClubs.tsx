
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const SportingClubs = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-8 text-center">Sporting Clubs</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Community Sports"
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6">
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  The Time Capsule is this year fundraising for and partnering with Community Sporting Clubs. Partnership Opportunities include:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Community engagement and fundraising opportunities</li>
                  <li>Brand exposure and recognition</li>
                  <li>Support for local sports development</li>
                </ul>
                <p>
                  If you are interested in partnering with the Time Capsule to raise more funds for your sporting club, please reach out to us using the contact form below.
                </p>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={() => window.location.href = "/contact"}
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
