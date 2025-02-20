
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: string;
  phone: string;
  state: string;
  playerStatus: string;
  playerReference?: string;
  aflClub: string;
}

export const useRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    password: "",
    phone: "",
    state: "",
    playerStatus: "",
    playerReference: "",
    aflClub: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.displayName || !formData.email || 
        !formData.password || !formData.phone || !formData.state || !formData.playerStatus || 
        !formData.aflClub || (formData.playerStatus === "new" && !formData.playerReference)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting registration process...");
      
      // Get the base URL for redirects
      const redirectBase = window.location.origin;
      
      // Sign up the user with metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            display_name: formData.displayName,
            phone: formData.phone,
            state: formData.state,
            player_status: formData.playerStatus,
            player_reference: formData.playerReference || null,
            afl_team: formData.aflClub,
          },
          emailRedirectTo: `${redirectBase}/login?verified=true`
        }
      });

      console.log("Sign up response:", { authData, signUpError });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        if (signUpError.message.includes('User already registered')) {
          toast.error('This email is already registered. Please try logging in instead.');
        } else {
          toast.error(signUpError.message || 'Error during registration');
        }
        return;
      }

      if (authData.user) {
        console.log("User created successfully:", authData.user);
        toast.success(
          "Registration successful! Please check your email to verify your account before logging in.",
          { duration: 15000 } // Increased to 15 seconds
        );
        navigate("/login");
      } else {
        console.error('No user data returned');
        toast.error("An unexpected error occurred during registration");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    handleSubmit,
  };
};

