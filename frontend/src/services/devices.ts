import type { Devices } from "@/types/devices";
import { httpRequest } from "./http";


export async function createDeviceRequest(user: Devices): Promise<Devices> {
  const url = 'http://localhost:8000/devices';
  return httpRequest<Devices, Devices>(url, user, {
    method: 'POST',
  });
}