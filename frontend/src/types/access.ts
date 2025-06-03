import type { Software } from "./software";
import type { StateRequest } from "./stateRequest";
import type { User } from "./user";

export type Access = {
  user_id: string;
  software_id: string;
  state_request_id: string;

  id?: string;
  created_at?: string;
  updated_at?: string;

  user?: User;
  software?: Software;
  state_request?: StateRequest;
};
