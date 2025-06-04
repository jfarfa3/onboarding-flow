export interface ItemSideBarProps {
  icono: React.ReactNode;
  title: string;
  to: string;
  isActive?: boolean;
  showLabel?: boolean;
  requiredPermission?: string[];
}
