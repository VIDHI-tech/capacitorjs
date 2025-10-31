import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { authenticated, hasAuthVerdict, isLoading, isError } = useAuth();
  const location = useLocation();

  // While probing /me (or before we have a verdict), don't redirect yet.
  if (isLoading || !hasAuthVerdict) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  // Once settled, if error or unauthenticated → go to login
  if (isError || !authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
