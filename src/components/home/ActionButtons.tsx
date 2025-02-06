
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center gap-4 w-full max-w-sm mx-auto">
      <Button 
        variant="secondary" 
        className="text-primary font-semibold w-full"
        onClick={() => navigate('/register')}
      >
        Register your account
      </Button>
      <Button 
        variant="secondary" 
        className="text-primary font-semibold w-full"
        onClick={() => navigate('/login')}
      >
        Log-in to your existing account
      </Button>
      <Button 
        variant="secondary" 
        className="text-primary font-semibold w-full"
        onClick={() => navigate('/sporting-clubs')}
      >
        Register your sporting club
      </Button>
    </div>
  );
};
