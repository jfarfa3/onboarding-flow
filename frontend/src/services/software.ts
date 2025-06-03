import type { Software } from "@/types/software";
import { httpRequest } from "./http";

const API_BASE = import.meta.env.VITE_API_URL;

export async function createSoftwareRequest(user: Software): Promise<Software> {
  return httpRequest<Software, Software>(`${API_BASE}software`, user, {
    method: "POST",
  });
}

export async function getAllSoftwareRequests(): Promise<Software[]> {
  return httpRequest<null, Software[]>(`${API_BASE}software`, null, {
    method: "GET",
  });
}
