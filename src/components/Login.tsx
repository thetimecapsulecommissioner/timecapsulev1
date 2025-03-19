
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase, trackLogin } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Parse competition ID and session ID from URL if they exist
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirectUrl');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Track successful login
      trackLogin('password');

      // If there's a redirect URL, use it, otherwise go to dashboard
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate("/dashboard");
      }
      toast.success("Login successful!");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm mx-4 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">Login</h2>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-primary hover:text-primary-dark"
            size="icon"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-1 text-right">
              <Link 
                to="/reset-password" 
                className="text-sm text-primary hover:text-primary-dark hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};
