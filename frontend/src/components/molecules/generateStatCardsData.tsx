import { User as UserIcon, Monitor, Key, Users, TrendingUp, TrendingDown } from "lucide-react";
import type { User } from "@/types/user";
import type { Devices } from "@/types/devices";
import type { Access } from "@/types/access";
import type { StartCardProps } from "./StatCard";

export function generateStatCardsData(
  users: User[],
  devices: Devices[],
  access: Access[]
): StartCardProps[] {
  // 1️⃣ Usuarios totales
  const totalUsers = users.length;

  // 2️⃣ Solicitudes de equipo pendientes
  const solicitudesEquipo = devices.filter(device => device.state_request?.label === 'Pendiente').length;

  // 3️⃣ Solicitudes de acceso pendientes
  const solicitudesAcceso = access.filter(acc => acc.state_request?.label === 'Pendiente').length;

  // 4️⃣ Nuevos roles técnicos (Desarrollador, DevOps, Líder Técnico, etc.)
  const rolesTecnicos = ["Desarrollador", "Líder Técnico", "DevOps", "Arquitecto de Software"];
  const nuevosRolesTecnicos = users.filter(user =>
    rolesTecnicos.includes(user.role?.label ?? "")
  ).length;

  // 5️⃣ Chart Data (simulado por ahora)
  const generateChartData = (value: number) => [
    { value: value - 2 },
    { value: value - 1 },
    { value },
    { value: value + 1 },
    { value: value + 2 }
  ];

  return [
    {
      title: "Usuarios",
      value: totalUsers,
      icon: <UserIcon size={40} />,
      percentageChange: "+3.2%", // Ajustar si tienes histórico
      trendIcon: <TrendingUp className="text-green-500" />,
      chartData: generateChartData(totalUsers),
      chartColor: "#3b82f6",
      className: "bg-gradient-to-r from-blue-50 to-blue-500 shadow-lg rounded-lg p-6 mb-4 text-blue-950"
    },
    {
      title: "Solicitudes de equipo",
      value: solicitudesEquipo,
      icon: <Monitor size={40} />,
      percentageChange: "+1.5%",
      trendIcon: <TrendingUp className="text-green-500" />,
      chartData: generateChartData(solicitudesEquipo),
      chartColor: "#f59e0b",
      className: "bg-gradient-to-r from-yellow-50 to-yellow-500 shadow-lg rounded-lg p-6 mb-4 text-yellow-900"
    },
    {
      title: "Solicitudes de acceso",
      value: solicitudesAcceso,
      icon: <Key size={40} />,
      percentageChange: "-0.5%",
      trendIcon: <TrendingDown className="text-red-500" />,
      chartData: generateChartData(solicitudesAcceso),
      chartColor: "#ef4444",
      className: "bg-gradient-to-r from-red-50 to-red-500 shadow-lg rounded-lg p-6 mb-4 text-red-900"
    },
    {
      title: "Nuevos roles técnicos",
      value: nuevosRolesTecnicos,
      icon: <Users size={40} />,
      percentageChange: "+4.8%",
      trendIcon: <TrendingUp className="text-green-500" />,
      chartData: generateChartData(nuevosRolesTecnicos),
      chartColor: "#10b981",
      className: "bg-gradient-to-r from-green-50 to-green-500 shadow-lg rounded-lg p-6 mb-4 text-green-900"
    }
  ];
}