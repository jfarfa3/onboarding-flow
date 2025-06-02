import { useLocation } from "react-router";
import Letter from "@/components/atoms/Letter";
import useSidebarStore from "@/store/sidebarStore";
import {
  LayoutDashboard,
  User,
  Key,
  Monitor,
  Menu as MenuIcon
} from "lucide-react";
import type { ItemSideBarProps } from "@/types/itemsSidebar";
import ItemSideBar from "../molecules/ItemSideBar";
const elementsSideBar: ItemSideBarProps[] = [
  {
    icono: <LayoutDashboard className="w-5 h-5" />,
    title: "Dashboard",
    to: "/dashboard",
  },
  {
    icono: <User className="w-5 h-5" />,
    title: "Usuarios",
    to: "/dashboard/users",
  },
  {
    icono: <Key className="w-5 h-5" />,
    title: "Accesos",
    to: "/dashboard/accesses",
  },
  {
    icono: <Monitor className="w-5 h-5" />,
    title: "Equipos",
    to: "/dashboard/devices",
  }
]

export default function Sidebar() {
  const location = useLocation();
  const { toggleSidebar, isOpen } = useSidebarStore();
  const logo = ["ON", "F"];
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
          <MenuIcon className="w-6 h-6 text-blue-500" />
        </button>
      </div>
      <nav className="flex-1 mt-5">
        {
          elementsSideBar.map((item, index) => (
            <button className="w-full" key={index}>
              <ItemSideBar
                key={index}
                icono={item.icono}
                title={item.title}
                to={item.to}
                isActive={location.pathname === item.to}
                showLabel={isOpen}
              />
            </button>
          ))
        }
      </nav>
    </div>
  );

}
