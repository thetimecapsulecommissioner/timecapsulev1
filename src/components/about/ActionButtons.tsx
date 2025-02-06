
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
      <Button 
        variant="secondary" 
        className="text-primary font-semibold"
        onClick={() => navigate('/register')}
      >
        Register your account
      </Button>
      <Button 
        variant="secondary" 
        className="text-primary font-semibold"
        onClick={() => navigate('/login')}
      >
        Log-in to your existing account
      </Button>
      <Button 
        variant="secondary" 
        className="text-primary font-semibold"
        onClick={() => navigate('/sporting-clubs')}
      >
        Register your sporting club
      </Button>
    </div>
  );
};
