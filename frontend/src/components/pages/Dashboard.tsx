import StatCard from "../molecules/StatCard";
import { TrendingUp, User, Monitor, Key, TrendingDown, Users } from "lucide-react";
import PendingDevicesTable from "../organism/PendingDevicesTable";
import PendingAccessTable from "../organism/PendingAccessTable";

const statCardsData = [
  {
    title: "Usuarios",
    value: "350",
    icon: <User size={40} />,
    percentageChange: "+3.2%",
    trendIcon: <TrendingUp className="text-green-500" />,
    chartData: [
      { value: 10 },
      { value: 25 },
      { value: 20 },
      { value: 35 },
      { value: 50 }
    ],
    chartColor: "#3b82f6", // azul
    className: "bg-gradient-to-r from-blue-50 to-blue-500 shadow-lg rounded-lg p-6 mb-4 text-blue-950"
  },
  {
    title: "Solicitudes de equipo",
    value: "15",
    icon: <Monitor size={40} />,
    percentageChange: "+1.5%",
    trendIcon: <TrendingUp className="text-green-500" />,
    chartData: [
      { value: 2 },
      { value: 4 },
      { value: 3 },
      { value: 7 },
      { value: 9 }
    ],
    chartColor: "#f59e0b", // amarillo
    className: "bg-gradient-to-r from-yellow-50 to-yellow-500 shadow-lg rounded-lg p-6 mb-4 text-yellow-900"
  },
  {
    title: "Solicitudes de acceso",
    value: "8",
    icon: <Key size={40} />,
    percentageChange: "-0.5%",
    trendIcon: <TrendingDown className="text-red-500" />,
    chartData: [
      { value: 1 },
      { value: 3 },
      { value: 2 },
      { value: 2 },
      { value: 4 }
    ],
    chartColor: "#ef4444", // rojo
    className: "bg-gradient-to-r from-red-50 to-red-500 shadow-lg rounded-lg p-6 mb-4 text-red-900"
  },
  {
    title: "Nuevos roles técnicos",
    value: "45",
    icon: <Users size={40} />,
    percentageChange: "+4.8%",
    trendIcon: <TrendingUp className="text-green-500" />,
    chartData: [
      { value: 5 },
      { value: 10 },
      { value: 12 },
      { value: 9 },
      { value: 9 }
    ],
    chartColor: "#10b981",
    className: "bg-gradient-to-r from-green-50 to-green-500 shadow-lg rounded-lg p-6 mb-4 text-green-900"
  }
];

export default function Dashboard() {
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
      <h2 className="text-3xl font-bold mt-8 mb-4 text-blue-900">
        Pending Requests
      </h2>
      <div className="flex flex-row gap-6">
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-blue-800">
            Pending Devices
          </h3>
          <PendingDevicesTable />
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-blue-800">
            Pending Accesses
          </h3>
          <PendingAccessTable />
        </section>
      </div>
    </div>
  );
}