import type { Access } from "./access";
import type { Devices } from "./devices";
import type { Roles } from "./roles";


export type User = {
  id?: string;
  name: string;
  email: string;
  area: string;
  team: string;
  role_id: string;
  role?: Roles;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_active: boolean;

  devices?:Devices[];
  access?: Access[];
};
