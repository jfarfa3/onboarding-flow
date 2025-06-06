import type { DynamicColumns } from "@/types/dynamicTable";
import Div from "../atoms/Div";
import type { Software } from "@/types/software";
import { useEffect, useState } from "react";
import { useRoleRequest } from "@/hooks/useRole";
import { createSoftwareRequest, updateSoftwareRequest } from "@/services/software";
import { useSoftwareRequest } from "@/hooks/useSoftware";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import DynamicFilterTable from "../organism/DynamicFilterTable";
import type { FieldConfig } from "@/types/input";
import { usePermissions } from "@/hooks/usePermissions";

const softwareColumnsTemplate: DynamicColumns<Software>[] = [
  {
    header: "Nombre",
    accessor: "name",
    key: "name",
    type: "text",
    extractor: (item) => item.name,
    editable: false,
  },
  {
    header: "Descripción",
    accessor: "description",
    key: "description",
    type: "text",
    extractor: (item) => item.description || "",
    editable: true,
  },
  {
    header: "URL",
    accessor: "url",
    key: "url",
    type: "text",
    extractor: (item) => item.url || "",
    editable: true,
  },
  {
    header: "Activo",
    accessor: (item) => item.is_active ? "Sí" : "No",
    key: "is_active",
    type: "checkbox",
    extractor: (item) => item.is_active,
    editable: true,
  },
  {
    header: "Roles Requeridos",
    accessor: (item) => {
      if (!item.roles || item.roles.length === 0) {
        return "Ninguno";
      }
      return (
        <div className="flex flex-wrap gap-2">
          {item.roles.map(role => (
            <span
              key={role.id}
              className="font-medium bg-blue-300 border-2 rounded px-2 py-1"
            >
              {role.label}
            </span>
          ))}
        </div>
      );
    },
    key: "roles_required",
    type: "multi-select",
    options: [],
    extractor: (item) => item.roles?.map(role => role.id) || [],
    editable: true,
  }
];

const softwareFilterOptions: FieldConfig[] = [
  {
    type: "select",
    label: "Filtrar y ordenar por",
    name: "sortBy",
    id: "sortBy",
    placeholder: "Selecciona una opción",
    options: [
      { value: "name", label: "Nombre" },
      { value: "description", label: "Descripción" },
      { value: "url", label: "URL" },
      { value: "is_active", label: "Activo" },
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
  }
];

export default function ConfigPage() {
  const [softwareColumns, setSoftwareColumns] = useState<DynamicColumns<Software>[]>(softwareColumnsTemplate);
  const { rolesOptions } = useRoleRequest();
  const { software, setSoftware } = useSoftwareRequest();
  const normalizeRoles = (roles?: string[]) => [...(roles || [])].sort();


  useEffect(() => {
    const updatedColumns = softwareColumnsTemplate.map(column => {
      if (column.key === "roles_required" && (column.type === "select" || column.type === "multi-select")) {
        return {
          ...column,
          options: rolesOptions
        };
      }
      return column;
    });

    setSoftwareColumns(updatedColumns);
  }, [rolesOptions]);

  const saveSoftware = async (data: Software) => {
    try {
      const softwareCreated = await createSoftwareRequest(data);
      setSoftware([...software, softwareCreated]);
      showSuccessToast("Software creado correctamente", "create-software-success");
    } catch {
      showErrorToast("Error al crear el software", "create-software-error");
    }
  };

  const editSoftware = async (data: Software, item: Software) => {
    const softwareToUpdate: Partial<Software> = {
      name: data.name,
      description: data.description,
      url: data.url,
      is_active: data.is_active,
      roles_required: data.roles_required,
    };

    if (item.name === data.name &&
      item.description === data.description &&
      item.url === data.url &&
      item.is_active === data.is_active &&
      JSON.stringify(normalizeRoles(item.roles_required)) === JSON.stringify(normalizeRoles(data.roles_required))
    ) {
      return;
    }

    try {
      const updatedSoftware = await updateSoftwareRequest(softwareToUpdate, item.id);
      setSoftware(software.map(item => item.id === updatedSoftware.id ? updatedSoftware : item));
      showSuccessToast("Software actualizado correctamente", "update-software-success");
    } catch {
      showErrorToast("Error al actualizar el software", "update-software-error");
    }
  }

  const { canPerformAction } = usePermissions();

  return (
    <Div>
      <h1 className="text-2xl font-bold mb-4 text-black">Configuración</h1>
      <div className="flex -flex-col" >
        <h3>Softwares</h3>
        <DynamicFilterTable
          baseRequests={software}
          columns={softwareColumns}
          filterOptions={softwareFilterOptions}
          defaultSortBy="name"
          allowAddNew={canPerformAction("software", "create", undefined)}
          onSave={saveSoftware}
          onEdit={editSoftware}
          allowEdit={true}
          canEditRow={() => canPerformAction("software", "update", undefined)}
        />
      </div>
    </Div>
  );
}
