
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { Logo } from "./navigation/Logo";

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="fixed top-4 left-4 z-50">
        <Logo onClick={handleLogoClick} />
      </div>
      <div className="fixed top-4 right-4 z-50">
        <ProfileDropdown />
      </div>
      
      <div className="container mx-auto py-24 px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-primary text-lg">Welcome to your dashboard!</p>
        </div>
      </div>
    </div>
  );
};
