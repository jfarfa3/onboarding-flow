import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, User, Mail, Building, Users, Shield, Monitor, Lock, CheckCircle, XCircle, Clock } from "lucide-react";
import type { User as UserType } from "@/types/user";
import type { Devices } from "@/types/devices";
import type { Access } from "@/types/access";
import type { Software } from "@/types/software";
import { useAllData } from "@/hooks/useAllData";
import { useSoftwareRequest } from "@/hooks/useSoftware";
import { useStateRequest } from "@/hooks/useStateRequest";
import { createDeviceRequest } from "@/services/devices";
import { createAccessRequest } from "@/services/access";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import Div from "../atoms/Div";

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const { users, setUsers } = useAllData();
  const { software } = useSoftwareRequest();
  const { stateRequest } = useStateRequest();
  const [user, setUser] = useState<UserType | null>(null);
  const [availableSoftware, setAvailableSoftware] = useState<Software[]>([]);
  const [isRequestingDevice, setIsRequestingDevice] = useState(false);
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<string>("");

  useEffect(() => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      const approvedOrPendingAccess = foundUser.access?.filter(a => 
        a.state_request?.label === "Aprobada" || a.state_request?.label === "Pendiente"
      ) || [];
      const userSoftwareIds = approvedOrPendingAccess.map(a => a.software_id);
      const available = software.filter(s => 
        !userSoftwareIds.includes(s.id || "") && 
        s.roles?.some(r => r.id === foundUser.role_id)
      );
      setAvailableSoftware(available);
    }
  }, [userId, users, software]);

  const handleRequestDevice = async () => {
    if (!user) return;
    setIsRequestingDevice(true);
    try {
      const pendingState = stateRequest.find(sr => sr.label === "Pendiente");
      const newDeviceRequest: Devices = {
        user_id: user.id || "",
        state_request_id: pendingState?.id || "",
      };
      
      const deviceCreated = await createDeviceRequest(newDeviceRequest);
      
      const updatedUser = {
        ...user,
        devices: [...(user.devices || []), deviceCreated]
      };
      
      setUser(updatedUser);
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      setUsers(updatedUsers);
      
      showSuccessToast("Solicitud de equipo creada correctamente");
    } catch {
      showErrorToast("Error al crear la solicitud de equipo", "device-request-error");
    } finally {
      setIsRequestingDevice(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!user || !selectedSoftware) return;
    setIsRequestingAccess(true);
    try {
      const pendingState = stateRequest.find(sr => sr.label === "Pendiente");
      const newAccessRequest: Access = {
        user_id: user.id || "",
        software_id: selectedSoftware,
        state_request_id: pendingState?.id || "",
      };
      
      const accessCreated = await createAccessRequest(newAccessRequest);
      const softwareData = software.find(s => s.id === selectedSoftware);
      if (softwareData) {
        accessCreated.software = softwareData;
      }
      
      const updatedUser = {
        ...user,
        access: [...(user.access || []), accessCreated]
      };
      
      setUser(updatedUser);
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      setUsers(updatedUsers);
      
      const approvedOrPendingAccess = updatedUser.access?.filter(a => 
        a.state_request?.label === "Aprobada" || a.state_request?.label === "Pendiente"
      ) || [];
      const userSoftwareIds = approvedOrPendingAccess.map(a => a.software_id);
      const available = software.filter(s => 
        !userSoftwareIds.includes(s.id || "") && 
        s.roles?.some(r => r.id === user.role_id)
      );
      setAvailableSoftware(available);
      setSelectedSoftware("");
      
      showSuccessToast("Solicitud de acceso creada correctamente");
    } catch {
      showErrorToast("Error al crear la solicitud de acceso", "access-request-error");
    } finally {
      setIsRequestingAccess(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprobada":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Rechazada":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (!user) {
    return (
      <Div>
        <div className="p-6 text-black">
          <Link to="/dashboard/users" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a usuarios
          </Link>
          <div className="text-center py-8">
            <p className="text-gray-500">Usuario no encontrado</p>
          </div>
        </div>
      </Div>
    );
  }

  return (
    <Div>
      <div className="p-6 text-black">
        <Link to="/dashboard/users" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver a usuarios
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.role?.label || "Sin rol asignado"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-500" />
                <span>{user.area || "No asignada"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <span>{user.team || "No asignado"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className={`px-2 py-1 rounded-full text-sm ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.is_active ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Equipos Asignados
              </h2>
              <button
                onClick={handleRequestDevice}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isRequestingDevice ? "Solicitando..." : "Solicitar Equipo"}
              </button>
            </div>
            
            {user.devices && user.devices.length > 0 ? (
              <div className="space-y-3">
                {user.devices.map((device, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {device.model || "-"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Serial: {device.serial_number || "-"}
                        </p>
                        <p className="text-sm text-gray-500">
                          SO: {device.system_operating || "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(device.state_request?.label || "")}
                        <span className="text-sm font-medium">
                          {device.state_request?.label || "Pendiente"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No tiene equipos asignados</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Accesos a Aplicaciones
              </h2>
              {availableSoftware.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedSoftware}
                    onChange={(e) => setSelectedSoftware(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="">Seleccionar aplicación</option>
                    {availableSoftware.map((soft) => (
                      <option key={soft.id} value={soft.id}>
                        {soft.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRequestAccess}
                    disabled={isRequestingAccess || !selectedSoftware}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isRequestingAccess ? "Solicitando..." : "Solicitar"}
                  </button>
                </div>
              )}
            </div>
            
            {user.access && user.access.length > 0 ? (
              <div className="space-y-3">
                {user.access.map((access, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {access.software?.name || "Aplicación desconocida"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {access.software?.description || "Sin descripción"}
                        </p>
                        {access.software?.url && (
                          <a 
                            href={access.software.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {access.software.url}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(access.state_request?.label || "")}
                        <span className="text-sm font-medium">
                          {access.state_request?.label || "Pendiente"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No tiene accesos asignados</p>
            )}
            
            {availableSoftware.length === 0 && user.access && user.access.length > 0 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Todas las aplicaciones disponibles para su rol ya han sido solicitadas
              </p>
            )}
          </div>
        </div>
      </div>
    </Div>
  );
}
