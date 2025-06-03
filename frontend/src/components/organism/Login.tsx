import { generateJwt } from "@/mocks/jwt";
import { getUser } from "@/mocks/users";
import DynamicForm from "@/components/molecules/DynamicForm";
import useSessionStore from "@/store/sessionStore";
import type { FieldConfig } from "@/types/input";
import { showErrorToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRoleRequest } from "@/hooks/useRole";

const loginFormConfigTemplate: FieldConfig[][] = [
  [
    {
      type: "text",
      label: "Usuario",
      name: "usuario",
      id: "usuario",
      placeholder: "Ingresa tu usuario",
      required: true

    },
    {
      id: "rol",
      name: "rol",
      type: "select",
      label: "Selecciona tu rol",
      placeholder: "Selecciona tu rol",
      options: [],
      required: true
    }
  ],
  [
    {
      type: "password",
      label: "Contraseña",
      name: "contrasena",
      id: "contrasena",
      placeholder: "Ingresa tu contraseña",
      required: true,
      regex: "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])\\S{8,16}$",
      validationMessage: "La contraseña debe tener entre 8 y 16 caracteres, al menos un número, una mayúscula y una minúscula.",
    }
  ]
] as const;

export default function LoginForm() {
  const [formConfig, setFormConfig] = useState<FieldConfig[][]>(loginFormConfigTemplate);
  const roleOptions = useRoleRequest();
  
  useEffect(() => {
    const updatedConfig = loginFormConfigTemplate.map(row =>
      row.map(field => {
        if (field.name === "rol" && field.type === "select") {
          return { ...field, options: roleOptions };
        }
        return field;
      })
    );
    setFormConfig(updatedConfig);
  }, [roleOptions]);

  const navigate = useNavigate();
  const { setSessionToken } = useSessionStore();
  const handleLoginSubmit = (data: Record<string, string>) => {
    const user = getUser(data.usuario, data.rol);
    generateJwt(user).then((token) => {
      setSessionToken(token);
      setTimeout(() => {
        navigate("/dashboard");
      }
        , 3000);
    }).catch(() => {
      showErrorToast("Error al generar el token JWT", "jwt-error");
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg text-black">
      <h2>Iniciar Sesión</h2>
      <DynamicForm config={formConfig} onSubmit={handleLoginSubmit} />
    </div>
  );
};
