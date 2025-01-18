import { ProfileDropdown } from "@/components/ProfileDropdown";

export const Navigation = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-primary z-50 shadow-md">
      <div className="container mx-auto px-4 py-1 flex justify-between items-center">
        <img 
          src="/lovable-uploads/3b3da353-b5c7-4a52-ac15-a9833289a7f1.png" 
          alt="Time Capsule Logo" 
          className="w-20 h-20 object-contain"
        />
        <ProfileDropdown />
      </div>
    </div>
  );
};