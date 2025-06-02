import { generateJwt } from "@/mocks/jwt";
import { getUser } from "@/mocks/users";
import DynamicForm from "@/components/molecules/DynamicForm";
import useSessionStore from "@/store/sessionStore";
import type { FieldConfig } from "@/types/input";
import { generateRoleOptions, type roles } from "@/types/roles";
import { showErrorToast } from "@/utils/toast";
import { useNavigate } from "react-router";

const loginFormConfig: FieldConfig[][] = [
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
      value: 'dev' as roles,
      options: generateRoleOptions(),
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
  const navigate = useNavigate();
  const { setSessionToken } = useSessionStore();
  const handleLoginSubmit = (data: Record<string, string>) => {
    const user = getUser(data.usuario, data.rol as roles);
    generateJwt(user).then((token) => {
      setSessionToken(token);
      navigate("/dashboard");
    }).catch(() => {
      showErrorToast("Error al generar el token JWT", "jwt-error");
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg text-black">
      <h2>Iniciar Sesión</h2>
      <DynamicForm config={loginFormConfig} onSubmit={handleLoginSubmit} />
    </div>
  );
};
