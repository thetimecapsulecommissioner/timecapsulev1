
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
    if (!formData.firstName || !formData.lastName || !formData.displayName || !formData.email || 
        !formData.password || !formData.phone || !formData.state || !formData.playerStatus || 
        (formData.playerStatus === "new" && !formData.playerReference) || !formData.aflClub) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
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
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        toast.error(signUpError.message);
        return;
      }

      if (authData.user) {
        // Show success message with email verification instructions
        toast.success(
          "Registration successful! Please check your email to verify your account before logging in. " +
          "If you don't see the email, please check your spam folder.",
          {
            duration: 6000 // Show for 6 seconds since it's a longer message
          }
        );
        navigate("/login");
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
