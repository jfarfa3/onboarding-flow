import useDevicesStore from "@/store/devicesStore";
import useAccessStore from "@/store/accessStore";
import useUsersStore from "@/store/userStore";
import { httpRequest } from "@/services/http";
import { useEffect } from "react";
import type { User } from "@/types/user";
import type { Devices } from "@/types/devices";
import type { Access } from "@/types/access";
import { showErrorToast } from "@/utils/toast";

const API_URL = import.meta.env.VITE_API_URL;

export function useAllData() {
  const { setDevices, devices, setDevicesPending } = useDevicesStore();
  const { setAccess, access, setAccessPending } = useAccessStore();
  const { users, setUsers } = useUsersStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const allUsers = await httpRequest<null, User[]>(
          `${API_URL}users/`,
          null,
          {
            method: "GET",
          }
        );
        const devices = await httpRequest<null, Devices[]>(
          `${API_URL}devices/`,
          null,
          {
            method: "GET",
          }
        );

        const access = await httpRequest<null, Access[]>(
          `${API_URL}access/`,
          null,
          {
            method: "GET",
          }
        );

        setDevices(devices);
        setAccess(access);
        const dataReal: User[] = allUsers.map((user) => {
          const userDevices = devices.filter(
            (device) => device.user_id === user.id
          );
          const userAccess = access.filter((acc) => acc.user_id === user.id);
          return {
            ...user,
            devices: userDevices,
            access: userAccess,
          };
        });
        setUsers(dataReal);
        access.forEach((acc) => {
          const user = allUsers.find((user) => user.id === acc.user_id);
          if (user) {
            acc.user = user;
          }
        });
        devices.forEach((device) => {
          const user = allUsers.find((user) => user.id === device.user_id);
          if (user) {
            device.user = user;
          }
        });
        setDevicesPending(
          devices.filter(
            (device) => device.state_request?.label === "Pendiente"
          )
        );
        setAccessPending(
          access.filter((acc) => acc.state_request?.label === "Pendiente")
        );
      } catch {
        showErrorToast("Error al cargar los datos", "error-fetch-data");
      }
    }

    fetchData();
  }, [
    setDevices,
    setAccess,
    setDevicesPending,
    setAccessPending,
    setUsers,
  ]);
  return {
    devices,
    access,
    users,
    setUsers,
  };
}
