import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../organism/Sidebar";
import useSessionChecker from "@/hooks/useSessionChecker";

export default function DashboardLayout() {
  const navigate = useNavigate();

  useSessionChecker({
    onSessionInValid: () => {
      console.error("Session is invalid or expired.");
      navigate("/");
    }
  });

  return (
    <div className="flex min-h-screen relative w-full">
      <Sidebar />
      <section className={`flex-1 transition-all duration-400 w-full`}>
        <Outlet />
      </section>
    </div>
  );
}
