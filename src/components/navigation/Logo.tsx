
interface LogoProps {
  onClick: () => void;
}

export const Logo = ({ onClick }: LogoProps) => (
  <img 
    src="/lovable-uploads/3b3da353-b5c7-4a52-ac15-a9833289a7f1.png" 
    alt="Time Capsule Logo" 
    className="w-20 h-20 object-contain cursor-pointer -ml-[7px]"
    onClick={onClick}
  />
);

