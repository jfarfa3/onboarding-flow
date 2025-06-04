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

export async function updateSoftwareRequest(software:Partial<Software>, softwareId?: string): Promise<Software> {
  if (!softwareId) {
    throw new Error("Software ID is required for update");
  }
  return httpRequest<Partial<Software>, Software>(`${API_BASE}software/${softwareId}`, software, {
    method: "PUT",
  });
}
