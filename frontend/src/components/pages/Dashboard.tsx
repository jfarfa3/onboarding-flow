import StatCard from "../molecules/StatCard";
import PendingDevicesTable from "../organism/PendingDevicesTable";
import PendingAccessTable from "../organism/PendingAccessTable";
import { useAllData } from "@/hooks/useAllData";
import { generateStatCardsData } from "../molecules/generateStatCardsData";
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSessionStore from "@/store/sessionStore";

export default function Dashboard() {
  const { users, devices, access } = useAllData();
  const { hasPermission, userId } = usePermissions();
  const { sessionToken } = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionToken) return;
    
    const hasEditPermissions = hasPermission([
      "equipment:approve:any", "access:approve:any"
    ]);

    if (!hasEditPermissions && userId) {
      navigate(`/dashboard/user/${userId}`);
    }
  }, [sessionToken, hasPermission, userId, navigate]);

  const statCardsData = generateStatCardsData(
    users,
    devices,
    access
  );
  return (
    <div className="flex flex-col min-h-screen bg-blue-50 text-gray-800 p-4 w-full">
      <h1 className="text-4xl font-bold mb-6 text-left text-blue-900 py-8">
        Hi, Welcome back 👋
      </h1>
      <div className="flex flex-row gap-4 justify-center w-full">
        {statCardsData.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            percentageChange={card.percentageChange}
            trendIcon={card.trendIcon}
            chartData={card.chartData}
            chartColor={card.chartColor}
            className={card.className}
          />
        ))}
      </div>
      <h2 className="text-3xl font-bold mt-8 mb-4 text-blue-900 w-full">
        Solicitudes Pendientes
      </h2>
      <div className="flex flex-row gap-6 w-full">
        <section className="flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-blue-800">
            Equipos Pendientes
          </h3>
          <PendingDevicesTable />
        </section>
        <section className="flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-blue-800">
            Accesos Pendientes
          </h3>
          <PendingAccessTable />
        </section>
      </div>
    </div>
  );
}