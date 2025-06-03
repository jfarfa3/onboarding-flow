import type { Access } from "@/types/access";
import type { DynamicColumns } from "@/types/dynamicTable";
import type { FieldConfig } from "@/types/input";
import useAccessStore from "@/store/accessStore";
import DynamicFilterTable from "./DynamicFilterTable";

const columns: DynamicColumns<Access>[] = [
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
        {item.user?.role?.label || "Sin rol asignado"}
      </span>
    )
  },
  {
    header: "Software",
    accessor: (item) => item.software?.name ?? "-"
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
      { value: "user.role.label", label: "Rol" },
      { value: "software.name", label: "Software" },
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

export default function PendingAccessTable() {
  const { accessPending } = useAccessStore();
  return (
    <DynamicFilterTable
      baseRequests={accessPending}
      columns={columns}
      filterOptions={filterOptions}
      defaultSortBy="user.name"
    />
  );
}