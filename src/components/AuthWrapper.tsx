
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { LoadingState } from "./ui/LoadingState";

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isLoggedIn, isLoading } = useAuthCheck();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
