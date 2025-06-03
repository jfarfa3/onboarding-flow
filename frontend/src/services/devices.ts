import type { Devices } from "@/types/devices";
import { httpRequest } from "./http";

const API_URL = import.meta.env.VITE_API_URL;

export async function createDeviceRequest(user: Devices): Promise<Devices> {
  return httpRequest<Devices, Devices>(`${API_URL}devices`, user, {
    method: "POST",
  });
}
