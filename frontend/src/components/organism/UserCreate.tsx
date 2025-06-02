import type { FieldConfig } from "@/types/input";
import DynamicForm from "../molecules/DynamicForm";
import { generateRoleOptions } from "@/types/roles";

const userFormConfig: FieldConfig[][] = [
  [
    {
      type: "text",
      label: "Nombre",
      name: "name",
      id: "name",
      placeholder: "Nombre completo",
      required: true
    }
  ],
  [
    {
      type: "email",
      label: "Correo",
      name: "email",
      id: "email",
      placeholder: "nombre@email.com.com",
      required: true,
      regex: "^[a-zA-Z0-9._%+-]+@email\\.com$",
      validationMessage: "Solo se permiten correos @email.com"
    }
  ],
  [
    {
      type: "text",
      label: "Área",
      name: "area",
      id: "area",
      placeholder: "Nombre del área",
      required: true
    },
    {
      type: "text",
      label: "Equipo",
      name: "team",
      id: "team",
      placeholder: "Nombre del área",
      required: true
    }
  ],
  [
    {
      type: "select",
      label: "Rol",
      name: "rol",
      id: "rol",
      placeholder: "Selecciona un rol",
      required: true,
      options: generateRoleOptions(),
      validationMessage: "Selecciona un rol válido"
    }
  ],
  [
    {
      type: "date",
      label: "Fecha de ingreso",
      name: "dateOfJoining",
      id: "dateOfJoining",
      placeholder: "Selecciona la fecha",
      required: true,
      value: new Date().toISOString().split("T")[0] // Fecha actual en formato YYYY-MM-DD
    }
  ]
];

export default function UserCreate() {
  const handleSubmit = (data: Record<string, string>) => {
    console.log("Datos del formulario:", data);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow text-black">
      <DynamicForm config={userFormConfig} onSubmit={handleSubmit} />
    </div>

  );
}