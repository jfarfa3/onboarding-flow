import type { User } from "./user";

export type Devices = {
  id: string;
  serialNumber?: string;
  model?: string;
  so?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  stateRequest: "pending" | "accepted" | "rejected";
};
