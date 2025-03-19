
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Privacy = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-primary py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us when you register for an account, participate in competitions, or contact us.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and for other purposes as described in this policy.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
          <p className="mb-4">
            We do not share your personal information with third parties except as described in this policy.
          </p>
          
          <h2 className="text-xl font-semibold mb-3">4. Your Choices</h2>
          <p className="mb-4">
            You can access, update, or delete your account information at any time by logging into your account settings.
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
