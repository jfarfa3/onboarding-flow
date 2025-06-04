import { BadgeCheck, BadgeAlert, ShieldCheck } from 'lucide-react';
import type { Devices } from "@/types/devices";
import type { DynamicColumns } from "@/types/dynamicTable";
import useDevicesStore from '@/store/devicesStore';
import type { FieldConfig } from '@/types/input';
import DynamicFilterTable from './DynamicFilterTable';
import { updateDeviceRequest } from '@/services/devices';
import { useStateRequest } from '@/hooks/useStateRequest';
import { showErrorToast } from '@/utils/toast';
import { useEffect, useState } from 'react';

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
  const { stateRequest, stateRequestOptions } = useStateRequest();
  const [deviceColumns, setDeviceColumns] = useState<DynamicColumns<Devices>[]>(deviceColumnsTemplate);

  useEffect(() => {
    const updateColumns = deviceColumnsTemplate.map(column => {
      if (column.key === "state_request", column.type === "select") {
        return { ...column, options: stateRequestOptions };
      }
      return column;
    });
    setDeviceColumns(updateColumns);
  }, [stateRequestOptions]);

  const handleEditDevice = async (data: Devices, item: Devices) => {
    const deviceToUpdate: Partial<Devices> = {
      serial_number: data.serial_number,
      model: data.model,
      system_operating: data.system_operating,
      state_request_id: data.state_request_id,
    }
    if(item.serial_number === data.serial_number &&
       item.model === data.model &&
       item.system_operating === data.system_operating &&
       item.state_request_id === data.state_request_id) {
      return;
    }
    try {
      const deviceUpdated = await updateDeviceRequest(deviceToUpdate, item.id);
      deviceUpdated.state_request = stateRequest.find(sr => sr.id === deviceUpdated.state_request_id) || undefined;
      const updatedDevices = devices.map((device) =>
        device.id === deviceUpdated.id ? {
          ...device,
          ...deviceUpdated,
          user: device.user
          
        } : device
      );
      setDevices(updatedDevices);
    } catch {
      showErrorToast("Error al actualizar el dispositivo", 'error-update-device');
    }
  };

  return (
    <DynamicFilterTable
      baseRequests={devices}
      columns={deviceColumns}
      filterOptions={deviceFilterOptions}
      defaultSortBy="state_request.label"
      onEdit={handleEditDevice}
      allowAddNew={false}
      allowEdit={true}
      canEditRow={(item) => item.state_request?.label === "Pendiente"}
    />
  );
}