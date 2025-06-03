import type { StateRequest } from "./stateRequest";
import type { User } from "./user";

export type Devices = {
  serial_number?: string;
  model?: string;
  system_operating?: string;
  user_id: string;
  state_request_id: string;
  id?: string;
  created_at?: string;
  updated_at?: string;

  user?: User;
  state_request?: StateRequest;
};
