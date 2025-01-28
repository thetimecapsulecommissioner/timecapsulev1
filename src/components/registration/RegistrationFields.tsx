import { Input } from "@/components/ui/input";
import { StateSelect } from "./StateSelect";
import { OrganizationSelect } from "./OrganizationSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RegistrationFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    organization: string;
    state: string;
    playerStatus: string;
    playerReference?: string;
  };
  onChange: (field: string, value: string) => void;
}

export const RegistrationFields = ({ formData, onChange }: RegistrationFieldsProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
        <Input
          type="text"
          value={formData.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          className="w-full"
          placeholder="Enter your first name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <Input
          type="text"
          value={formData.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          className="w-full"
          placeholder="Enter your last name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
          className="w-full"
          placeholder="Create a password"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className="w-full"
          placeholder="Enter your phone number"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Player Status</label>
        <Select value={formData.playerStatus} onValueChange={(value) => onChange("playerStatus", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your player status" className="text-gray-700" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="previous" className="text-gray-700">Previous Player</SelectItem>
            <SelectItem value="new" className="text-gray-700">New Player</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.playerStatus === "new" && (
        <div>
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name of Current Player Reference
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-white p-2 rounded-lg shadow-lg text-gray-700">
                  <p>New Players this year require a current player reference. Please contact us via our Instagram or the Contact page on the website if you have any concerns or issues.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            type="text"
            value={formData.playerReference || ""}
            onChange={(e) => onChange("playerReference", e.target.value)}
            className="w-full"
            placeholder="Enter reference player name"
          />
        </div>
      )}
      <OrganizationSelect
        value={formData.organization}
        onChange={(value) => onChange("organization", value)}
      />
      <StateSelect
        value={formData.state}
        onChange={(value) => onChange("state", value)}
      />
    </>
  );
};