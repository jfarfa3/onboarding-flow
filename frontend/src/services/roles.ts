import type { Roles } from "@/types/roles";
import { httpRequest } from "./http";

const API_BASE = 'http://localhost:8000/'

export async function getRoles(): Promise<Roles[]> {
  const url = `${API_BASE}roles`;
  return httpRequest<null, Roles[]>(url, null, {
    method: 'GET',
  });
}