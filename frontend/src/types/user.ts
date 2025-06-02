import type { roles } from "./roles";

export type User = {
  id: string;
  name: string;
  email: string;
  area: string;
  team: string;
  role: roles;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive?: boolean;
};
