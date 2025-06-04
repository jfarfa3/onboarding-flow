import { useEffect, useState } from "react";
import { decodeJwtAndCheckExpiration } from "@/utils/jwt";
import { showErrorToast } from "@/utils/toast";
import useSessionStore from "@/store/sessionStore";
import { rolesAndPermissions, type DecodedJwtPayload } from "@/config/permissions";

interface UseSessionCheckerProps {
  onSessionValid?: () => void;
  onSessionInValid?: () => void;
  errorMessage?: string;
}

export default function useSessionChecker({
  onSessionValid,
  onSessionInValid,
  errorMessage,
}: UseSessionCheckerProps) {
  const { sessionToken, clearSessionToken } = useSessionStore();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
  if (!sessionToken || sessionToken.trim() === "") {
    onSessionInValid?.();
    setUserPermissions([]);
    setUserRole(null);
    return;
  }

  decodeJwtAndCheckExpiration(sessionToken)
    .then((decodedToken: DecodedJwtPayload) => {
      const roleLabel = decodedToken.role;
      setUserRole(roleLabel);

      const roleConfig = rolesAndPermissions.find(r => r.label === roleLabel);
      if (roleConfig) {
        setUserPermissions(roleConfig.permissions);
      } else {
        setUserPermissions([]);
        showErrorToast(
          `Rol "${roleLabel}" no definido en la configuración de permisos.`,
          "permission-error"
        );
      }

      onSessionValid?.();
    })
    .catch(() => {
      showErrorToast(
        errorMessage || "Ocurrió un error al verificar la sesión.",
        "session-checker"
      );
      clearSessionToken();
      onSessionInValid?.();
    });
}, [ sessionToken ]);

  const hasPermission = (permissionNeeded: string[]): boolean => {
    if (!userPermissions || userPermissions.length === 0) {
      return true; 
    }
    for (const permission of permissionNeeded) {
      if (userPermissions.includes(permission)) {
        return true;
      }
    }
    return false;
  };

  return { userRole, userPermissions, hasPermission };
}
