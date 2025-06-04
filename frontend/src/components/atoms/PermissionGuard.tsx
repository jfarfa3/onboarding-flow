import useSessionChecker from "@/hooks/useSessionChecker";

interface PermissionGuardProps {
  permission: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export default function PermissionGuard({ 
  permission, 
  children,
  fallback
}: PermissionGuardProps) {
  const { hasPermission } = useSessionChecker({});
  
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
    if (fallback) {
    return <>{fallback}</>;
  }
    return null;
}
