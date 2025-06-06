import React, { useState } from "react";
import DynamicFilterTable from "../organism/DynamicFilterTable";
import { type FieldConfig } from "@/types/input";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/utils/toast";
import type { DynamicColumns } from "@/types/dynamicTable";

// Tipo de ejemplo para nuestros datos
interface SampleData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

// Componente de ejemplo que demuestra cómo usar DynamicFilterTable
const FilterTableExample: React.FC = () => {
  // Datos de ejemplo
  const [data, setData] = useState<SampleData[]>([
    { 
      id: 1, 
      name: "Juan Pérez", 
      email: "juan@example.com", 
      role: "admin", 
      status: "active", 
      createdAt: "2025-01-15" 
    },
    { 
      id: 2, 
      name: "María López", 
      email: "maria@example.com", 
      role: "user", 
      status: "inactive", 
      createdAt: "2025-02-20" 
    },
    { 
      id: 3, 
      name: "Carlos Rodríguez", 
      email: "carlos@example.com", 
      role: "editor", 
      status: "active", 
      createdAt: "2025-03-05" 
    },
  ]);

  // Definición de columnas para la tabla
  const columns: DynamicColumns<SampleData>[] = [
    { 
      header: "ID", 
      accessor: "id", 
      key: "id", 
      type: "text", 
      editable: false,
      toCreate: false
    },
    { 
      header: "Nombre", 
      accessor: "name", 
      key: "name", 
      type: "text",
      editable: true,
      toCreate: true
    },
    { 
      header: "Email", 
      accessor: "email", 
      key: "email", 
      type: "text",
      editable: true,
      toCreate: true
    },
    { 
      header: "Rol", 
      accessor: "role", 
      key: "role", 
      type: "select",
      options: [
        { value: "admin", label: "Administrador" },
        { value: "user", label: "Usuario" },
        { value: "editor", label: "Editor" },
      ],
      editable: true,
      toCreate: true
    },
    { 
      header: "Estado", 
      accessor: "status", 
      key: "status", 
      type: "select",
      options: [
        { value: "active", label: "Activo" },
        { value: "inactive", label: "Inactivo" },
      ],
      editable: true,
      toCreate: true
    },
    { 
      header: "Fecha de Creación", 
      accessor: "createdAt", 
      key: "createdAt", 
      type: "text",
      editable: false,
      toCreate: false
    },
  ];

  // Opciones de filtrado
  const filterOptions: FieldConfig[] = [
    {
      type: "select",
      label: "Rol",
      name: "role",
      id: "role-filter",
      options: [
        { value: "admin", label: "Administrador" },
        { value: "user", label: "Usuario" },
        { value: "editor", label: "Editor" },
      ],
    },
    {
      type: "select",
      label: "Estado",
      name: "status",
      id: "status-filter",
      options: [
        { value: "active", label: "Activo" },
        { value: "inactive", label: "Inactivo" },
      ],
    }
  ];

  // Manejadores de eventos
  const handleSave = async (newItem: Partial<SampleData>) => {
    try {
      // Simulamos la creación de un nuevo ítem
      const newId = Math.max(...data.map(item => item.id)) + 1;
      const now = new Date().toISOString().split('T')[0];
      
      const createdItem: SampleData = {
        id: newId,
        name: newItem.name || "",
        email: newItem.email || "",
        role: newItem.role || "user",
        status: newItem.status || "active",
        createdAt: now
      };
      
      setData([...data, createdItem]);
      showSuccessToast("Ítem creado exitosamente", "success");
    } catch (error) {
      console.error("Error al guardar:", error);
      showErrorToast("Error al crear el ítem", "error");
    }
  };

  const handleEdit = async (updatedItem: SampleData, originalItem: SampleData) => {
    console.log("Editando ítem:", updatedItem, "Original:", originalItem);
    try {
      const updatedData = data.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      
      setData(updatedData);
      showSuccessToast("Ítem actualizado exitosamente", "success");
    } catch (error) {
      console.error("Error al actualizar:", error);
      showErrorToast("Error al actualizar el ítem", "error");
    }
  };

  const handleDelete = (item: SampleData) => {
    try {
      const updatedData = data.filter(d => d.id !== item.id);
      setData(updatedData);
      showSuccessToast("Ítem eliminado exitosamente", "success");
    } catch (error) {
      console.error("Error al eliminar:", error);
      showErrorToast("Error al eliminar el ítem", "error");
    }
  };

  // Función para determinar si un ítem puede ser editado
  const canEditRow = (item: SampleData) => {
    // Por ejemplo, podríamos restringir la edición de ciertos ítems
    return item.status !== "locked";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Ejemplo de Tabla Dinámica con Filtros</h2>
      
      <DynamicFilterTable
        baseRequests={data}
        columns={columns}
        filterOptions={filterOptions}
        defaultSortBy="name"
        actions={(item) => (
          <div className="flex space-x-2">
            <button 
              className="text-blue-500 hover:text-blue-700"
              onClick={() => showInfoToast(`Visualizando ${item.name}`, "info")}
            >
              Ver
            </button>
            <button 
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(item)}
            >
              Eliminar
            </button>
          </div>
        )}
        onSave={handleSave}
        onEdit={handleEdit}
        allowAddNew={true}
        allowEdit={true}
        canEditRow={canEditRow}
      />
    </div>
  );
};

export default FilterTableExample;
