import type { DynamicColumns } from "@/types/dynamicTable";
import Div from "../atoms/Div";
import type { Software } from "@/types/software";
import { useEffect, useState } from "react";
import { useRoleRequest } from "@/hooks/useRole";
import { createSoftwareRequest } from "@/services/software";
import { useSoftwareRequest } from "@/hooks/useSoftware";
import { showErrorToast } from "@/utils/toast";
import DynamicFilterTable from "../organism/DynamicFilterTable";

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

export default function ConfigPage() {
  const [softwareColumns, setSoftwareColumns] = useState<DynamicColumns<Software>[]>(softwareColumnsTemplate);
  const { rolesOptions } = useRoleRequest();
  const { software, setSoftware } = useSoftwareRequest();

  useEffect(() => {
    const updatedColumns = softwareColumns.map(column => {
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
      console.log("Saving software:", data);
      const softwareCreated = await createSoftwareRequest(data);
      setSoftware([...software, softwareCreated]);
    } catch (error) {
      console.error("Error creating software:", error);
      showErrorToast("Error al crear el software", "create-software-error");
    }
  };

  const editSoftware = async (data: Software, originalItem: Software) => {
    console.log("Edit software functionality not implemented yet", data, originalItem);
  }


  return (
    <Div>
      <h1 className="text-2xl font-bold mb-4 text-black">Configuración</h1>
      <div className="flex -flex-col" >
        <h3>Softwares</h3>
        <DynamicFilterTable
          baseRequests={software}
          columns={softwareColumns}
          filterOptions={[]}
          defaultSortBy="name"
          allowAddNew={true}
          onSave={saveSoftware}
          onEdit={editSoftware}
          allowEdit={true}
          canEditRow={(item) => item.is_active}
        />
      </div>
    </Div>
  );
}
