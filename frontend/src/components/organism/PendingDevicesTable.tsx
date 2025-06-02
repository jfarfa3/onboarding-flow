import type { DynamicColumns } from "@/types/dynamicTable";
import DynamicPendingTable from "../layout/DynamicTable"
import type { Devices } from "@/types/devices";
import type { FieldConfig } from "@/types/input";
import { getPendingDevices } from "@/data/users";
import { RoleEnum } from "@/types/roles";

const columns: DynamicColumns<Devices>[] = [
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
    header: "Modelo",
    accessor: (item) => item.model ?? "-"
  },
  {
    header: "Estado",
    accessor: () => "Pendiente",
  }
];

const filterOptions: FieldConfig[] = [
  {
    type: "select",
    label: "Filtrar y ordenar por",
    name: "sortBy",
    id: "sortBy",
    placeholder: "Selecciona una opción",
    options: [
      { value: "user.name", label: "Nombre" },
      { value: "user.role", label: "Rol" },
      { value: "model", label: "Modelo" },
      { value: "stateRequest", label: "Estado" },
    ],
    state: "default",
  },
  {
    type: "text",
    label: "Texto a filtrar",
    name: "filterText",
    id: "filterText",
    placeholder: "Ingresa un texto para filtrar",
    state: "default",
  },
  {
    type: "select",
    label: "Ordenar por",
    name: "order",
    id: "order",
    placeholder: "Selecciona un orden",
    options: [
      { value: "asc", label: "Ascendente" },
      { value: "desc", label: "Descendente" },
    ],
    state: "default",
  },
];

export default function PendingDevicesTable() {
  return (
      <DynamicPendingTable
        baseRequests={getPendingDevices()}
        columns={columns}
        filterOptions={filterOptions}
        defaultSortBy="user.name"
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