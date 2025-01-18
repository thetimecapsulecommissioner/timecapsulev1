import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrganizationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const OrganizationSelect = ({ value, onChange }: OrganizationSelectProps) => {
  const organizations = [
    "Inner North Brewing Company",
    "Local Sports Club",
    "Community Center",
    "Neighborhood Association",
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Community Organisation</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an organization" className="text-gray-700" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {organizations.map((org) => (
            <SelectItem key={org} value={org} className="text-gray-700">
              {org}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};