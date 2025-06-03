import { useStateRequest } from "@/hooks/useStateRequest";
import { createAccessRequest } from "@/services/access";
import useAccessStore from "@/store/accessStore";
import type { Access } from "@/types/access";
import type { DynamicColumns } from "@/types/dynamicTable";
import type { FieldConfig } from "@/types/input";
import { showErrorToast } from "@/utils/toast";
import { BadgeAlert, BadgeCheck, ShieldCheck } from "lucide-react";
import DynamicFilterTable from "./DynamicFilterTable";

const accessColumnsTemplate: DynamicColumns<Access>[] = [
  {
    header: "Usuario",
    accessor: (item) => item.user ? item.user.name : "-",
    type: "text",
    key: "user_id",
  },
  {
    header: "Software",
    accessor: (item) => item.software ? item.software.name : "-",
    type: "text",
    key: "software_id",
  },
  {
    header: "Estado",
    accessor: (item) =>
      item.state_request?.label === "Aprobada" ? (
        <div className="flex items-center">
          <BadgeCheck className="w-5 h-5 text-green-500 mr-2" />
          Aprobada
        </div>
      ) : item.state_request?.label === "Pendiente" ? (
        <div className="flex items-center">
          <BadgeAlert className="w-5 h-5 text-yellow-500 mr-2" />
          Pendiente
        </div>
      ) : item.state_request?.label === "Rechazada" ? (
        <div className="flex items-center">
          <ShieldCheck className="w-5 h-5 text-red-500 mr-2" />
          Rechazada
        </div>
      ) : (
        <span className="text-gray-500">Sin estado</span>
      ),
  },
];

const accessFilterOptions: FieldConfig[] = [
  {
    type: "select",
    label: "Ordenar por",
    name: "sortBy",
    id: "sortBy",
    placeholder: "Selecciona una opción",
    options: [
      { value: "user.name", label: "Usuario" },
      { value: "software.name", label: "Software" },
      { value: "state_request.label", label: "Estado" },
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
    label: "Orden",
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

export default function AccessTable() {
  const { access, setAccess } = useAccessStore();
  const { stateRequest } = useStateRequest();

  const handleSaveAccess = async (data: any) => {

    const newAccess: Access = {
      user_id: data.user_id || "",
      software_id: data.software_id || "",
      state_request_id: stateRequest.find(sr => sr.label === "Pendiente")?.id || "",
    };
    try {
      const accessCreated = await createAccessRequest(newAccess);
      setAccess([...access, accessCreated]);
    } catch {
      showErrorToast("Error al crear la solicitud de acceso", "create-access-error");
    }
  };
  return (
    <DynamicFilterTable
      baseRequests={access}
      columns={accessColumnsTemplate}
      filterOptions={accessFilterOptions}
      defaultSortBy="user.name"
      onSave={handleSaveAccess}
      allowAddNew={false}
      allowEdit={false}
      actions={(item) =>
        item.state_request?.label === "Pendiente" && (
          <div className="flex items-center space-x-2">
            <button
              className="p-2 bg-green-500 text-white hover:bg-green-600 rounded"
              onClick={() => {
                // TODO: lógica para aprobar acceso
              }}
            >
              Creado
            </button>
            <button
              className="p-2 bg-red-500 text-white hover:bg-red-600 rounded"
              onClick={() => {
                // TODO: lógica para rechazar acceso
              }}
            >
              Solicitud Rechazada
            </button>
          </div>
        )
      }
    />
  );
}