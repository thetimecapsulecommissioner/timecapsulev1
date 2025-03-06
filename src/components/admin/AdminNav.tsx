
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button 
        variant={currentPath === "/admin" ? "default" : "outline"}
        onClick={() => navigate("/admin")}
        className="w-full sm:w-auto"
      >
        Users & Predictions
      </Button>
      
      <Button 
        variant={currentPath === "/admin/competitions" ? "default" : "outline"}
        onClick={() => navigate("/admin/competitions")}
        className="w-full sm:w-auto"
      >
        Competitions
      </Button>
      
      <Button 
        variant={currentPath === "/admin/administrators" ? "default" : "outline"}
        onClick={() => navigate("/admin/administrators")}
        className="w-full sm:w-auto"
      >
        Administrators
      </Button>
    </div>
  );
};
