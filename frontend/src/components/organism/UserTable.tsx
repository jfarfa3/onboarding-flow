import { getAllUsers } from "@/data/users"
import { RoleEnum } from "@/types/roles"
import { BadgeCheck, BadgeAlert, ShieldCheck, EllipsisVertical } from 'lucide-react';
import DynamicTable from "../molecules/DynamicTable";
import type { UserDetail } from "@/types/userDetail";
import type { DynamicColumns } from "@/types/dynamicTable";


export default function UserTable() {
  const users = getAllUsers()
  const userColumns: DynamicColumns<UserDetail>[] = [
    {
      header: "Nombre",
      accessor: (item) => (
        <span className="font-medium">
          {item.user.name} - {item.user.email.split('@')[0]}
        </span>
      ),
    },
    {
      header: "Área",
      accessor: (item) => item.user.area ?? "-",
    },
    {
      header: "Equipo",
      accessor: (item) => item.user.team ?? "-",
    },
    {
      header: "Rol",
      accessor: (item) => (
        <span className="capitalize text-gray-600">
          {RoleEnum[item.user.role.toUpperCase() as keyof typeof RoleEnum] ??
            item.user.role}
        </span>
      ),
    },
    {
      header: "Equipo asignado",
      accessor: (item) =>
        item.devices.length > 0 ? (
          item.devices.some(device => device.stateRequest === 'accepted') ? (
            <div className="flex items-center">
              <BadgeCheck className="w-5 h-5 text-green-500 mr-2" />
            </div>
          ) : (
            <div className="flex items-center">
              <BadgeAlert className="w-5 h-5 text-yellow-500 mr-2" />
            </div>
          )
        ) : (
          <div className="flex items-center">
            <BadgeAlert className="w-5 h-5 text-red-500 mr-2" />
          </div>
        )
    },
    {
      header: "Estado",
      accessor: (item) =>
        item.user.isActive ? (
          <div className="flex items-center">
            <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
            Activo
          </div>
        ) : (
          <div className="flex items-center">
            <BadgeAlert className="w-5 h-5 text-red-500 mr-2" />
            Inactivo
          </div>
        ),
    },
  ];
  return (
    <DynamicTable
      data={users}
      columns={userColumns}
      actions={(item) => (
        <button
          onClick={() => console.log(`Edit user: ${item.user.id}`)}
          className="text-gray-500 hover:text-gray-700"
        >
          <EllipsisVertical className="w-5 h-5" />
        </button>
      )}
    />
  )
}