import { Input } from "@/components/ui/input";
import { StateSelect } from "./StateSelect";
import { OrganizationSelect } from "./OrganizationSelect";

interface RegistrationFieldsProps {
  formData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    organization: string;
    state: string;
  };
  onChange: (field: string, value: string) => void;
}

export const RegistrationFields = ({ formData, onChange }: RegistrationFieldsProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full"
          placeholder="Enter your name"
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