import { useStateRequest } from "@/hooks/useStateRequest";
import useAccessStore from "@/store/accessStore";
import type { Access } from "@/types/access";
import type { DynamicColumns } from "@/types/dynamicTable";
import type { FieldConfig } from "@/types/input";
import { showErrorToast } from "@/utils/toast";
import { BadgeAlert, BadgeCheck, ShieldCheck } from "lucide-react";
import DynamicFilterTable from "./DynamicFilterTable";
import { updateStateAccessRequest } from "@/services/access";

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

  const sendUpdateAccessRequest = async (stateLabel: string, accessId?: string,) => {
    const newStateRequest = stateRequest.find(
      (state) => state.label === stateLabel
    );
    if (!newStateRequest || !newStateRequest.id) {
      showErrorToast("Estado 'Aprobada' no encontrado", 'error-state-not-found');
      return;
    }
    if (!accessId) {
      showErrorToast("ID de acceso no encontrado", 'error-access-id-not-found');
      return;
    }
    try {
      await updateStateAccessRequest(accessId, newStateRequest.id);
      const updatedAccess = access.map((item) =>
        item.id === accessId
          ? { ...item, state_request: newStateRequest, state_request_id: newStateRequest.id }
          : item
      );
      setAccess(updatedAccess);
    } catch {
      showErrorToast("Error al actualizar la solicitud de acceso", 'error-access-update');
    }
  }

  const handleAccessRejected = async (item: Access) => {
    await sendUpdateAccessRequest("Rechazada", item.id);
  }

  const handleAccessCreated = async (item: Access) => {
    await sendUpdateAccessRequest("Aprobada", item.id);
  };
  return (
    <DynamicFilterTable
      baseRequests={access}
      columns={accessColumnsTemplate}
      filterOptions={accessFilterOptions}
      defaultSortBy="state_request.label"
      allowAddNew={false}
      allowEdit={false}
      actions={(item) =>
        item.state_request?.label === "Pendiente" && (
          <div className="flex items-center space-x-2">
            <button
              className="p-2 bg-green-500 text-white hover:bg-green-600 rounded"
              onClick={() => {
                handleAccessCreated(item);
              }}
            >
              Creado
            </button>
            <button
              className="p-2 bg-red-500 text-white hover:bg-red-600 rounded"
              onClick={() => {
                handleAccessRejected(item);
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