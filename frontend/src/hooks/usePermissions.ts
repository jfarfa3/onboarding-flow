import { useEffect, useState } from "react";
import useSessionChecker from "@/hooks/useSessionChecker";
import { decodeJwtAndCheckExpiration } from "@/utils/jwt";
import useSessionStore from "@/store/sessionStore";

export function usePermissions() {
  const { hasPermission, userRole } = useSessionChecker({});
  const [userId, setUserId] = useState<string | null>(null);
  const { sessionToken } = useSessionStore();

  useEffect(() => {
    if (sessionToken) {
      decodeJwtAndCheckExpiration(sessionToken)
        .then((decodedToken) => {
          setUserId(decodedToken.id);
        })
        .catch(() => {
          setUserId(null);
        });
    }
  }, [sessionToken]);

  const filterItemsByPermission = <T>(
    items: T[],
    resourceType: string,
    action: string,
    itemUserId: (item: T) => string | undefined
  ): T[] => {
    const hasAnyPermission = hasPermission([`${resourceType}:${action}:any`]);
    const hasSelfPermission = hasPermission([`${resourceType}:${action}:self`]);

    if (hasAnyPermission) {
      return items;
    } else if (hasSelfPermission && userId) {
      return items.filter(item => itemUserId(item) === userId);
    } else {
      return [];
    }
  };

  const canPerformAction = (
    resourceType: string,
    action: string,
    itemUserId?: string
  ): boolean => {
    const hasAnyPermission = hasPermission([`${resourceType}:${action}:any`]);
    const hasSelfPermission = hasPermission([`${resourceType}:${action}:self`]);

    if (hasAnyPermission) {
      return true;
    }
    
    if (hasSelfPermission && itemUserId === userId) {
      return true;
    }
    
    return false;
  };

  return {
    hasPermission,
    userRole,
    filterItemsByPermission,
    canPerformAction,
    userId
  };
}
