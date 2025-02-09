
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRegistration } from "@/hooks/useRegistration";
import { RegistrationFields } from "./registration/RegistrationFields";
import { ScrollText } from "lucide-react";

export const RegisterForm = () => {
  const { formData, setFormData, isLoading, handleSubmit } = useRegistration();

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm mx-4 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center">Join Time Capsule</h2>
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
          <ScrollText className="h-4 w-4" />
          <span className="text-sm">Scroll to see all fields</span>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <RegistrationFields
              formData={formData}
              onChange={handleFieldChange}
            />
            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </ScrollArea>
      </div>
    </div>
  );
};
