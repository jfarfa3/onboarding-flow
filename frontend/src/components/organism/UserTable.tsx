import { BadgeCheck, BadgeAlert, ShieldCheck } from 'lucide-react';
import type { DynamicColumns } from "@/types/dynamicTable";
import type { FieldConfig } from "@/types/input";
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
import { createAccessByRol } from '@/services/access';
import DynamicFilterTable from './DynamicFilterTable';

const columnsTemplate: DynamicColumns<User>[] = [
  {
    header: "Nombre",
    accessor: 'name',
    type: "text",
    key: "name",
    extractor: (item) => item.name,
    editable: true,
    toCreate: true,
  },
  {
    header: "Correo",
    accessor: (item) => (
      <span className="text-gray-500">
        {item.email}
      </span>
    ),
    type: "email",
    key: "email",
    toCreate: true,
    extractor: (item) => item.email,
    editable: false,
  },
  {
    header: "Área",
    accessor: (item) => item.area ?? "-",
    type: "text",
    key: "area",
    extractor: (item) => item.area,
    editable: true,
    toCreate: true,
  },
  {
    header: "Equipo",
    accessor: (item) => item.team ?? "-",
    type: "text",
    key: "team",
    extractor: (item) => item.team,
    editable: true,
    toCreate: true,
  },
  {
    header: "Rol",
    accessor: (item) => (
      <span className="capitalize text-gray-600">
        {item.role?.label || "Sin rol asignado"}
      </span>
    ),
    type: "select",
    options: [],
    key: "role_id",
    extractor: (item) => item.role?.id || "",
    editable: true,
    toCreate: true,
  },
  {
    header: "Dispositivos asignados",
    accessor: (item) =>
      item.devices && item.devices.length > 0 ? (
        item.devices?.some(device => device.state_request?.label === 'Aprobada') ? (
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
    toCreate: true,
    editable: false,
  },
  {
    header: "Permisos de acceso",
    accessor: (item) =>
      item.access && item.access.length > 0 ? (
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
    toCreate: true,
    editable: false,
  },
  {
    header: "Estado",
    accessor: (item) =>
      item.is_active ? (
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
    type: "checkbox",
    key: "isActive",
    extractor: (item) => item.is_active,
    editable: true,
    toCreate: false,
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
      { value: "name", label: "Nombre" },
      { value: ".email", label: "Correo" },
      { value: "role.label", label: "Rol" },
      { value: "area", label: "Área" },
      { value: "team", label: "Equipo" },
      { value: "isActive", label: "Estado" },
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
  const [columns, setColumns] = useState<DynamicColumns<User>[]>(columnsTemplate);
  const {rolesOptions} = useRoleRequest();
  const {software} = useSoftwareRequest();
  const { roles } = useRolesStore();
  const { stateRequest } = useStateRequest();
  const { users, setUsers } = useAllData();

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

  const handleSave = async (data: User) => {
    const newUser: User = {
      name: data.name as string,
      email: data.email as string,
      area: data.area as string,
      team: data.team as string,
      role_id: data.role_id as string,
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
      const accessRequestCreated = await createAccessByRol(userCreated.id || "", userCreated.role_id, software, stateRequest.find(sr => sr.label === "Pendiente")?.id || "");
      const userDetail: User = {
        ...userCreated,
        devices: [deviceRequestCreated],
        access: accessRequestCreated,
      }
      setUsers([...users, userDetail]);
    } catch {
      showErrorToast("Error al crear el usuario", "create-user-error");
    }
  }

  const handleEdit = async (data: User, item: User) => {
    console.log("Edit user data:", data, "for item:", item);
    // try {
      // TODO:Aquí debes implementar tu lógica para actualizar el usuario (PATCH o PUT)
    //   const updatedUsersDetail = usersDetail.map(detail => {
    //     if (detail.user.id === data.id) {
    //       return {
    //         ...detail,
    //         user: {
    //           ...detail.user,
    //           name: data.name,
    //           email: data.email,
    //           area: data.area,
    //           team: data.team,
    //           role_id: data.role,
    //         },
    //       };
    //     }
    //     return detail;
    //   });
    //   setUsersDetail(updatedUsersDetail);
    // } catch {
    //   showErrorToast("Error al editar el usuario", "edit-user-error");
    // }
  };

  return (
    <DynamicFilterTable
      baseRequests={users}
      columns={columns}
      filterOptions={filterOptions}
      defaultSortBy="user.name"
      onSave={handleSave}
      onEdit={handleEdit}
      allowAddNew={true}
      allowEdit={true}
    />
  )
}