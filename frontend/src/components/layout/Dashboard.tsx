import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../organism/Sidebar";
import useSessionChecker from "@/hooks/useSessionChecker";
import { showErrorToast } from "@/utils/toast";

export default function DashboardLayout() {
  const navigate = useNavigate();

  useSessionChecker({
    onSessionInValid: () => {
      showErrorToast("Sesión expirada, por favor inicia sesión nuevamente.", "error-session-expired");
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
