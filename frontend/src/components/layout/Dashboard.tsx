import { Outlet } from "react-router-dom";
import Sidebar from "../organism/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen relative w-full">
      <Sidebar />
      <section className={`flex-1 transition-all duration-400 w-full`}>
        <Outlet />
      </section>
    </div>
  );
}