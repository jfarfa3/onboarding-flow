import { httpRequest } from "./http";
import type { StateRequest } from "@/types/stateRequest";

const API_BASE = import.meta.env.VITE_API_URL;

export async function getStateRequests(): Promise<StateRequest[]> {
  return httpRequest<null, StateRequest[]>(`${API_BASE}state-requests`, null, {
    method: "GET",
  });
}
