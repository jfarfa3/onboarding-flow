import { getPendingAccesses } from "@/data/users"
import DynamicTable from "../molecules/DynamicTable"
import { RoleEnum } from "@/types/roles"
import type { Access } from "@/types/access"
import type { DynamicColumns } from "@/types/dynamicTable"

export default function PendingAccessTable() {
  const request = getPendingAccesses()
  const requestColumns: DynamicColumns<Access>[] = [
    {
      header: "Nombre",
      accessor: (item) => (
        <span className="font-medium">
          {item.user?.name} - {item.user?.email?.split('@')[0]}
        </span>
      )
    },
    {
      header: "Rol",
      accessor: (item) => (
        <span className="capitalize text-gray-600">
          {RoleEnum[item.user?.role?.toUpperCase() as keyof typeof RoleEnum] ?? item.user?.role}
        </span>
      )
    },
    {
      header: "Software",
      accessor: (item) => item.software?.name ?? "-"
    },
    {
      header: "Estado",
      accessor: (item) => item.stateRequest ?? "otro"
    }
  ];

  return (
    <DynamicTable
      data={request}
      columns={requestColumns}
      actions={(item) => (
        <div className="flex items-center space-x-2 flex-col">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => console.log(`View request ${item.id}`)}
          >
            View
          </button>
          <button
            className="text-green-500 hover:text-green-700"
            onClick={() => console.log(`Approve request ${item.id}`)}
          >
            Approve
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => console.log(`Reject request ${item.id}`)}
          >
            Reject
          </button>
        </div>
      )}
    />
  )
}