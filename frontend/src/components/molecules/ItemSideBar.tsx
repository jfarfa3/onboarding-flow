import type { ItemSideBarProps } from "@/types/itemsSidebar";
import { Link } from "react-router-dom";
import { Dot } from "lucide-react";

export default function ItemSideBar({ icono, title, to, isActive = false, showLabel }: ItemSideBarProps) {
  return (
    <nav className="flex-1 mt-5">
      <ul className="space-y-2">
        <li>
          <Link
            to={to}
            className={`flex justify-baseline ${isActive ? "bg-blue-50" : ""}`}
          >
            <div
              className={`flex items-center gap-2 p-2 rounded text-blue-400 font-medium hover:bg-blue-100 transition-colors duration-200 w-full ${isActive ? "bg-blue-50" : ""}`}
            >
              {icono}

              {showLabel && (
                title
              )}

            </div>
            {isActive && (
              <Dot className="w-10 h-10 text-blue-500 bg-blue-50" />
            )}
          </Link>
        </li>
      </ul>
    </nav>
  )
}