import type { Devices } from "@/types/devices";
import { httpRequest } from "./http";

const API_URL = import.meta.env.VITE_API_URL;

export async function createDeviceRequest(user: Devices): Promise<Devices> {
  return httpRequest<Devices, Devices>(`${API_URL}devices`, user, {
    method: "POST",
  });
}

export async function updateDeviceRequest(device: Partial<Devices>, deviceId?: string): Promise<Devices> {
  if (!deviceId) {
    throw new Error("Device ID is required for update");
  }
  return httpRequest<Partial<Devices>, Devices>(`${API_URL}devices/${deviceId}`, device, {
    method: "PUT",
  });
}