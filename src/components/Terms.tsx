
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Terms = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Time Capsule. By accessing our website, you agree to these terms and conditions.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">2. Use of the Service</h2>
          <p className="mb-4">
            Our service allows users to participate in prediction competitions. Users must comply with all applicable laws and regulations.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
          <p className="mb-4">
            Users are responsible for maintaining the confidentiality of their account information and for all activities under their account.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">4. Privacy</h2>
          <p className="mb-4">
            Our Privacy Policy describes how we handle user data and is incorporated by reference into these Terms.
          </p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-all duration-300"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
