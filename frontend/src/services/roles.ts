import type { Roles } from "@/types/roles";
import { httpRequest } from "./http";

const API_BASE = import.meta.env.VITE_API_URL;

export async function getRoles(): Promise<Roles[]> {
  return httpRequest<null, Roles[]>(`${API_BASE}roles`, null, {
    method: "GET",
  });
}
