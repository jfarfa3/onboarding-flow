import type { roles } from "./roles";

export type Software = {
  id: string;
  name: string;
  description: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: roles[];
};
