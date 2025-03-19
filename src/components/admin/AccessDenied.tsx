
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AccessDenied = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto my-8 p-6 bg-card rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Access Denied</h1>
      <p className="text-center mb-6">You don't have permission to view this page.</p>
      <div className="flex justify-center">
        <Button onClick={() => navigate("/dashboard")} className="mr-2">
          Return to Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate("/profile")}>
          Go to Profile
        </Button>
      </div>
    </div>
  );
};
