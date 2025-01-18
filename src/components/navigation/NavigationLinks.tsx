import { useNavigate } from "react-router-dom";

export const NavigationLinks = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="flex gap-6 ml-5">
      <button 
        onClick={() => navigate("/dashboard")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        Home
      </button>
      <button 
        onClick={() => navigate("/about")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        About
      </button>
      <button 
        onClick={() => navigate("/leaderboard")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        Leaderboard
      </button>
      <button 
        onClick={() => navigate("/community-groups")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        Community Groups
      </button>
      <button 
        onClick={() => navigate("/contact")} 
        className="text-secondary hover:text-secondary-light transition-colors"
      >
        Contact
      </button>
    </nav>
  );
};