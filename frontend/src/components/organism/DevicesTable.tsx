import { BadgeCheck, BadgeAlert, ShieldCheck } from 'lucide-react';
import type { Devices } from "@/types/devices";
import type { DynamicColumns } from "@/types/dynamicTable";
import useDevicesStore from '@/store/devicesStore';
import type { FieldConfig } from '@/types/input';
import DynamicFilterTable from './DynamicFilterTable';
import { createDeviceRequest } from '@/services/devices';
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
    key: "user_id",
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
    key: "user_id",
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
    key: "state_request",
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


  const handleSaveDevice = async (data: any) => {
    const newDevice: Devices = {
      serial_number: data.serial_number || "",
      model: data.model || "",
      system_operating: data.system_operating || "",
      user_id: data.user_id || "",
      state_request_id: stateRequest.find(sr => sr.label === "Pendiente")?.id || "",
    };

    try {
      const deviceCreated = await createDeviceRequest(newDevice);
      setDevices([...devices, deviceCreated]);
    } catch {
      showErrorToast("Error al crear la solicitud de equipo", "create-device-error");
    }
  };

  const handleEditDevice = async (data: Devices, originalItem: Devices) => {
    // TODO: Implement edit functionality if needed
    console.log("Edit device functionality not implemented yet", data, originalItem);
  };

  return (
    <DynamicFilterTable
      baseRequests={devices}
      columns={deviceColumns}
      filterOptions={deviceFilterOptions}
      defaultSortBy="user.name"
      onSave={handleSaveDevice}
      onEdit={handleEditDevice}
      allowAddNew={false}
      allowEdit={true}
      canEditRow={(item) => item.state_request?.label === "Pendiente"}
    />
  );
}