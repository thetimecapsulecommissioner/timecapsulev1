
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
      >
        Users & Predictions
      </Button>
      
      <Button 
        variant={currentPath === "/admin/competitions" ? "default" : "outline"}
        onClick={() => navigate("/admin/competitions")}
      >
        Competitions
      </Button>
      
      <Button 
        variant={currentPath === "/admin/administrators" ? "default" : "outline"}
        onClick={() => navigate("/admin/administrators")}
      >
        Administrators
      </Button>
    </div>
  );
};
