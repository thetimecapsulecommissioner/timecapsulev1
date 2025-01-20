import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center gap-4 pl-8">
      <Button 
        variant="secondary" 
        className="text-primary font-semibold w-64"
        onClick={() => navigate('/register')}
      >
        Register your account
      </Button>
      <Button 
        variant="secondary" 
        className="text-primary font-semibold w-64"
        onClick={() => navigate('/login')}
      >
        Log-in to your existing account
      </Button>
      <Button 
        variant="secondary" 
        className="text-primary font-semibold w-64"
        onClick={() => navigate('/register-group')}
      >
        Register your community group
      </Button>
    </div>
  );
};