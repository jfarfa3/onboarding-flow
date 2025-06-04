import { BadgeCheck, BadgeAlert, ShieldCheck } from 'lucide-react';
import type { Devices } from "@/types/devices";
import type { DynamicColumns } from "@/types/dynamicTable";
import useDevicesStore from '@/store/devicesStore';
import type { FieldConfig } from '@/types/input';
import DynamicFilterTable from './DynamicFilterTable';
import { updateDeviceRequest } from '@/services/devices';
import { useStateRequest } from '@/hooks/useStateRequest';
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { useEffect, useState } from 'react';
import { usePermissions } from "@/hooks/usePermissions";

const deviceColumnsTemplate: DynamicColumns<Devices>[] = [
  {
    header: "Usuario",
    accessor: (item) => (
      <span className="font-medium">
        {item.user?.name || "Sin usuario asignado"}
      </span>
    ),
    type: "text",
    key: "user.name",
    extractor: (item) => item.user?.name || "",
    editable: false,
  },
  {
    header: "Serial",
    accessor: (item) => item.serial_number || "-",
    type: "text",
    key: "serial_number",
    extractor: (item) => item.serial_number || "",
    editable: true,
  },
  {
    header: "Modelo",
    accessor: (item) => item.model || "-",
    type: "text",
    key: "model",
    extractor: (item) => item.model || "",
    editable: true,
  },
  {
    header: "Sistema Operativo",
    accessor: (item) => item.system_operating || "-",
    type: "text",
    key: "system_operating",
    extractor: (item) => item.system_operating || "",
    editable: true,
  },
  {
    header: "Rol",
    accessor: (item) => item.user?.role?.label || "Sin rol asignado",
    type: "text",
    key: "user.role.label",
    extractor: (item) => item.user?.role?.label || "",
    editable: false,
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
    type: "select",
    key: "state_request_id",
    options: [],
    extractor: (item) => item.state_request?.id || "",
  },
];

const deviceFilterOptions: FieldConfig[] = [
  {
    type: "select",
    label: "Ordenar por",
    name: "sortBy",
    id: "sortBy",
    placeholder: "Selecciona una opción",
    options: [
      { value: "user.name", label: "Nombre" },
      { value: "serial_number", label: "Serial" },
      { value: "model", label: "Modelo" },
      { value: "system_operating", label: "Sistema Operativo" },
      { value: "user.role.label", label: "Rol" },
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

export default function Devicetable() {
  const { devices, setDevices } = useDevicesStore();
  const { stateRequest } = useStateRequest();
  const { filterItemsByPermission, canPerformAction } = usePermissions();
  const [deviceColumns, setDeviceColumns] = useState<DynamicColumns<Devices>[]>(deviceColumnsTemplate);

  const filteredDevices = filterItemsByPermission(
    devices, 
    "equipment", 
    "view", 
    (item) => item.user_id
  );

  useEffect(() => {
    if (!stateRequest.length) return;
    
    const stateRequestOptions = stateRequest.map(state => ({
      value: state.id || "",
      label: state.label || "",
    }));

    const updatedColumns = deviceColumnsTemplate.map(column => {
      if (column.key === "state_request_id") {
        return {
          ...column,
          options: stateRequestOptions,
        };
      }
      return column;
    });

    setDeviceColumns(updatedColumns);
  }, [stateRequest]);

  const editDevice = async (updatedItem: Devices, original: Devices) => {
    if (!original.id) return;

    if (!canPerformAction("equipment", "update", original.user_id)) {
      showErrorToast("No tienes permisos para editar este dispositivo", "permission-denied");
      return;
    }
    
    try {
      const device = {
        ...original,
        state_request_id: updatedItem.state_request_id || original.state_request_id,
        serial_number: updatedItem.serial_number || original.serial_number,
        model: updatedItem.model || original.model,
        system_operating: updatedItem.system_operating || original.system_operating,
      };

      const deviceUpdated = await updateDeviceRequest(device);

      const newStateRequest = stateRequest.find(
        (state) => state.id === deviceUpdated.state_request_id
      );

      const updatedDevice = {
        ...deviceUpdated,
        state_request: newStateRequest,
      };

      const devicesUpdated = devices.map((item) =>
        item.id === deviceUpdated.id ? updatedDevice : item
      );

      setDevices(devicesUpdated);
      showSuccessToast("Dispositivo actualizado correctamente");
    } catch {
      showErrorToast("Error al actualizar el dispositivo", "device-update-error");
    }
  };

  return (
    <DynamicFilterTable
      baseRequests={filteredDevices}
      columns={deviceColumns}
      filterOptions={deviceFilterOptions}
      defaultSortBy="user.name"
      allowAddNew={canPerformAction("equipment", "create", undefined)}
      onEdit={editDevice}
      allowEdit={true}
      canEditRow={(item) => 
        item.state_request?.label === "Pendiente" && 
        canPerformAction("equipment", "update", item.user_id)
      }
    />
  );
}