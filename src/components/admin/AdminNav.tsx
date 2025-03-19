
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const AdminNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "User Data", path: "/admin/user-data" },
    { name: "Administrators", path: "/admin/administrators" },
    { name: "User Activity", path: "/admin/user-activity" }
  ];

  return (
    <nav className="flex flex-wrap gap-2 mb-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium",
            currentPath === item.path
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
