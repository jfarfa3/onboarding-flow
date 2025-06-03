import { httpRequest } from "./http";
import type { StateRequest } from "@/types/stateRequest";

const API_BASE = 'http://localhost:8000/'

export async function getStateRequests(): Promise<StateRequest[]> {
  const url = `${API_BASE}state-requests`;
  return httpRequest<null, StateRequest[]>(url, null, {
    method: 'GET',
  });
}