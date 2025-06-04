import { generateJwt } from "@/mocks/jwt";
import DynamicForm from "@/components/molecules/DynamicForm";
import useSessionStore from "@/store/sessionStore";
import type { FieldConfig } from "@/types/input";
import { showErrorToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAllData } from "@/hooks/useAllData";

const loginFormConfigTemplate: FieldConfig[][] = [
  [
    {
      type: "select",
      label: "Usuario",
      name: "usuario",
      id: "usuario",
      placeholder: "Selecciona tu usuario",
      options: [],
      required: true,
    },
  ],
] as const;

export default function LoginForm() {
  const [formConfig, setFormConfig] = useState<FieldConfig[][]>(loginFormConfigTemplate);
  const { users } = useAllData();

  useEffect(() => {
    const userOptions = users.map((user) => ({ value: user.id || '', label: user.name }));
    const updatedConfig: FieldConfig[][] = loginFormConfigTemplate.map((row) =>
      row.map((field) => {
        if (field.name === "usuario" && field.type === "select") {
          return { ...field, options: userOptions };
        }
        return field;
      })
    );
    setFormConfig(updatedConfig);
  }, [users]);

  const navigate = useNavigate();
  const { setSessionToken } = useSessionStore();
  const handleLoginSubmit = (data: Record<string, string>) => {
    const selectedUser = users.find((user) => user.id === data.usuario);
    if (!selectedUser) {
      showErrorToast("Usuario no encontrado", "user-not-found");
      return;
    }
    generateJwt(selectedUser)
      .then((token) => {
        setSessionToken(token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      })
      .catch(() => {
        showErrorToast("Error al generar el token JWT", "jwt-error");
      });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg text-black">
      <h2>Iniciar Sesión</h2>
      <DynamicForm config={formConfig} onSubmit={handleLoginSubmit} />
    </div>
  );
}
