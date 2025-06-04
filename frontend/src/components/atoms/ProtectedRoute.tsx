import { useEffect } from "react";
import type { ReactElement } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import useSessionStore from "@/store/sessionStore";
import { showErrorToast } from "@/utils/toast";

interface ProtectedRouteProps {
  children: ReactElement;
  requiredPermission?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  redirectTo = "/",
}: ProtectedRouteProps): ReactElement {
  const { hasPermission, userId } = usePermissions();
  const { sessionToken } = useSessionStore();
  const location = useLocation();
  const params = useParams();

  const isUserDetailRoute = location.pathname.startsWith("/user/");
  const viewingOwnProfile = isUserDetailRoute && params.userId === userId;
  const hasAnyRequired = Array.isArray(requiredPermission) && requiredPermission.length > 0
    ? hasPermission(requiredPermission)
    : true;
  const shouldAllowAccess = viewingOwnProfile || hasAnyRequired;

  const shouldShowError =
    !!sessionToken &&
    !viewingOwnProfile &&
    !hasAnyRequired;

  useEffect(() => {
    if (shouldShowError) {
      showErrorToast(
        "No tienes permisos para acceder a esta página",
        "permission-denied"
      );
    }
  }, [shouldShowError]);
  if (!sessionToken) {
    return <Navigate to={redirectTo} replace />;
  }
  if (!shouldAllowAccess) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }
  return children;
}