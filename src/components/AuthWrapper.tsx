
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { LoadingState } from "./ui/LoadingState";

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isAuthChecking } = useAuthCheck();

  if (isAuthChecking) {
    return <LoadingState />;
  }

  // The hook redirects to login automatically if no session is found
  return <>{children}</>;
};
