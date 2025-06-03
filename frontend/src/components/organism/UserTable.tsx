import { BadgeCheck, BadgeAlert, ShieldCheck, EllipsisVertical } from 'lucide-react';
import type { UserDetail } from "@/types/userDetail";
import type { DynamicColumns } from "@/types/dynamicTable";
import type { FieldConfig } from "@/types/input";
import DynamicFilterTable from "./DynamicFilterTable";
import { useEffect, useState } from "react";
import { useRoleRequest } from "@/hooks/useRole";
import type { User } from "@/types/user";
import { createUser } from "@/services/user";
import { showErrorToast } from "@/utils/toast";
import useRolesStore from '@/store/roleStore';
import type { Devices } from '@/types/devices';
import { createDeviceRequest } from '@/services/devices';
import { useStateRequest } from '@/hooks/useStateRequest';
import { useSoftwareRequest } from '@/hooks/useSoftware';
import { useAllData } from '@/hooks/useAllData';
import { createAccess } from '@/services/access';

const columnsTemplate: DynamicColumns<UserDetail>[] = [
  {
    header: "Nombre",
    accessor: (item) => (
      <span className="font-medium">
        {item.user.name}
      </span>
    ),
    type: "text",
    key: "name",
  },
  {
    header: "Correo",
    accessor: (item) => (
      <span className="text-gray-500">
        {item.user.email}
      </span>
    ),
    type: "email",
    key: "email",
  },
  {
    header: "Área",
    accessor: (item) => item.user.area ?? "-",
    type: "text",
    key: "area",
  },
  {
    header: "Equipo",
    accessor: (item) => item.user.team ?? "-",
    type: "text",
    key: "team",
  },
  {
    header: "Rol",
    accessor: (item) => (
      <span className="capitalize text-gray-600">
        {item.user.role?.label || "Sin rol asignado"}
      </span>
    ),
    type: "select",
    options: [],
    key: "role",
  },
  {
    header: "Dispositivos asignados",
    accessor: (item) =>
      item.devices.length > 0 ? (
        item.devices.some(device => device.state_request?.label === 'Aprobada') ? (
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
      ),
    type: "checkbox",
    key: "devices",
  },
  {
    header: "Permisos de acceso",
    accessor: (item) =>
      item.access.length > 0 ? (
        item.access.some(access => access.state_request?.label === 'Aprobada') ? (
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
      ),
    type: "checkbox",
    key: "access",
  },
  {
    header: "Estado",
    accessor: (item) =>
      item.user.is_active ? (
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
]

const filterOptions: FieldConfig[] = [
  {
    type: "select",
    label: "Filtrar y ordenar por",
    name: "sortBy",
    id: "sortBy",
    placeholder: "Selecciona una opción",
    options: [
      { value: "user.name", label: "Nombre" },
      { value: "user.email", label: "Correo" },
      { value: "user.role.label", label: "Rol" },
      { value: "user.area", label: "Área" },
      { value: "user.team", label: "Equipo" },
      { value: "user.isActive", label: "Estado" },
      { value: "devices.length", label: "Dispositivos asignados" },
      { value: "access.length", label: "Permisos de acceso" },
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
]

export default function UserTable() {
  const [columns, setColumns] = useState<DynamicColumns<UserDetail>[]>(columnsTemplate);
  const {rolesOptions} = useRoleRequest();
  const {software} = useSoftwareRequest();
  const { roles } = useRolesStore();
  const { stateRequest } = useStateRequest();
  const { usersDetail, setUsersDetail } = useAllData();

  useEffect(() => {
    const updatedColumns = columnsTemplate.map(col => {
      if (col.key === "role" && col.type === "select") {
        return { ...col, options: rolesOptions };
      }
      return col;
    }
    );
    setColumns(updatedColumns);
  }, [rolesOptions]);

  const handleSave = async (data: any) => {
    const newUser: User = {
      name: data.name as string,
      email: data.email as string,
      area: data.area as string,
      team: data.team as string,
      role_id: data.role as string,
      last_login: new Date().toISOString(),
      is_active: true,
    }
    try {
      const userCreated = await createUser(newUser)
      userCreated.role = roles.find(role => role.id === userCreated.role_id) || undefined;
      const newDeviceRequest: Devices = {
        user_id: userCreated.id || "",
        state_request_id: stateRequest.find(sr => sr.label === "Pendiente")?.id || "",
      }
      const deviceRequestCreated = await createDeviceRequest(newDeviceRequest);
      const accessRequestCreated = await createAccess(userCreated.id || "", userCreated.role_id, software, stateRequest.find(sr => sr.label === "Pendiente")?.id || "");
      const userDetail: UserDetail = {
        user: userCreated,
        devices: [deviceRequestCreated],
        access: [...accessRequestCreated]
      }
      setUsersDetail([...usersDetail, userDetail]);
    } catch {
      showErrorToast("Error al crear el usuario", "create-user-error");
    }
  }

  return (
    <DynamicFilterTable
      baseRequests={usersDetail}
      columns={columns}
      filterOptions={filterOptions}
      defaultSortBy="user.name"
      onSave={handleSave}
      allowAddNew={true}
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