import type { Roles } from "./roles";

export type Software = {
  name: string;
  description: string;
  url: string;
  is_active: boolean;
  roles_required?: string[];

  roles?:Roles[];
  id?: string;
  created_at?: string;
  updated_at?: string;
};
