import type { Software } from "@/types/software";
import { httpRequest } from "./http";

export async function createSoftwareRequest(user: Software): Promise<Software> {
  const url = "http://localhost:8000/software";
  return httpRequest<Software, Software>(url, user, {
    method: "POST",
  });
}

export async function getAllSoftwareRequests(): Promise<Software[]> {
  const url = "http://localhost:8000/software";
  return httpRequest<null, Software[]>(url, null, {
    method: "GET",
  });
}
