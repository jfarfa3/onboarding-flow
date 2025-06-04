import { useLocation, useNavigate } from "react-router-dom";
import Letter from "@/components/atoms/Letter";
import useSidebarStore from "@/store/sidebarStore";
import useSessionStore from "@/store/sessionStore";
import {
  LayoutDashboard,
  User,
  Key,
  Monitor,
  Cog,
  Menu,
  LogOut,
} from "lucide-react";
import type { ItemSideBarProps } from "@/types/itemsSidebar";
import ItemSideBar from "../molecules/ItemSideBar";
import { showSuccessToast } from "@/utils/toast";
import PermissionGuard from "@/components/atoms/PermissionGuard";

const sidebarItems: ItemSideBarProps[] = [
  {
    icono: <LayoutDashboard className="w-5 h-5" />,
    title: "Dashboard",
    to: "/dashboard",
    requiredPermission:[]
  },
  {
    icono: <User className="w-5 h-5" />,
    title: "Usuarios",
    to: "/dashboard/users",
    requiredPermission: ["user:view:any"]
  },
  {
    icono: <Key className="w-5 h-5" />,
    title: "Accesos",
    to: "/dashboard/accesses",
    requiredPermission: ["access:view:any", "access:view:self"]
  },
  {
    icono: <Monitor className="w-5 h-5" />,
    title: "Equipos",
    to: "/dashboard/devices",
    requiredPermission: ["equipment:view:any", "equipment:view:self"]

  },
  {
    icono: <Cog className="w-5 h-5" />,
    title: "Configuración",
    to: "/dashboard/settings",
    requiredPermission: ["software:view:any"],
  }
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar, isOpen } = useSidebarStore();
  const { clearSessionToken } = useSessionStore();
  const logo = ["ON", "F"];

  const handleLogout = () => {
    clearSessionToken();
    showSuccessToast("Sesión cerrada correctamente");
    navigate("/");
  };
  
  return (
    <div className={`h-screen bg-white border-r flex flex-col flex-shrink-0 sticky top-0 overflow-y-auto ${isOpen ? "w-64" : "w-16 overflow-hidden"} transition-width duration-300`}>
      <div className={`w-full h-fit flex items-center border-b px-5 justify-between ${isOpen ? "flex-row" : "flex-col-reverse items-center"}`}>
        <div className="flex items-center">
          {
            isOpen ? (
              logo.map((letter, index) => (
                <Letter
                  key={index}
                  letter={letter}
                  firstLetter={index === 0}
                />
              ))
            ) : (
              <Letter letter="OF" firstLetter={true} />
            )
          }
        </div>
        <button
          onClick={toggleSidebar}
          className="ml-2 p-2 rounded hover:bg-blue-100 transition-colors duration-200"
        >
          <Menu className="w-6 h-6 text-blue-500" />
        </button>
      </div>
      
      <nav className="flex-1 mt-5">
        {
          sidebarItems.map((item, index) => 
            item.requiredPermission && item.requiredPermission.length > 0 ? (
              <PermissionGuard key={index} permission={item.requiredPermission|| []}>
                <button className="w-full">
                  <ItemSideBar
                    icono={item.icono}
                    title={item.title}
                    to={item.to}
                    isActive={location.pathname === item.to}
                    showLabel={isOpen}
                  />
                </button>
              </PermissionGuard>
            ) : (
              <button className="w-full" key={index}>
                <ItemSideBar
                  icono={item.icono}
                  title={item.title}
                  to={item.to}
                  isActive={location.pathname === item.to}
                  showLabel={isOpen}
                />
              </button>
            )
          )
        }
      </nav>
      
      <div className="mb-4 px-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 p-2 rounded text-red-500 font-medium hover:bg-red-50 transition-colors duration-200 ${
            !isOpen ? "justify-center" : ""
          }`}
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
}
