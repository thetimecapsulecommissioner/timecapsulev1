
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Pricing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-primary py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">Pricing Plans</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="p-6 bg-gray-50">
              <h2 className="text-2xl font-bold text-primary mb-2">Basic</h2>
              <p className="text-gray-500 mb-4">For casual predictors</p>
              <div className="text-3xl font-bold text-primary">
                $9.99<span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Access to public competitions
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email support
                </li>
              </ul>
              <Button 
                onClick={() => navigate("/register")}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 transform scale-105 z-10 border-2 border-secondary">
            <div className="p-6 bg-secondary text-primary">
              <h2 className="text-2xl font-bold mb-2">Pro</h2>
              <p className="text-primary-dark mb-4">For serious enthusiasts</p>
              <div className="text-3xl font-bold">
                $19.99<span className="text-sm font-normal text-primary-dark">/month</span>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All Basic features
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority access to new competitions
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <Button 
                onClick={() => navigate("/register")}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="p-6 bg-gray-50">
              <h2 className="text-2xl font-bold text-primary mb-2">Premium</h2>
              <p className="text-gray-500 mb-4">For professionals</p>
              <div className="text-3xl font-bold text-primary">
                $39.99<span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All Pro features
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom competition creation
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  API access
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dedicated account manager
                </li>
              </ul>
              <Button 
                onClick={() => navigate("/register")}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-white mb-4">Need a custom plan for your organization?</p>
          <Button 
            onClick={() => navigate("/contact")}
            className="bg-white hover:bg-gray-100 text-primary px-6 py-2 rounded-lg transition-all duration-300"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};
