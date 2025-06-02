import type { Software } from "./software";
import type { User } from "./user";

export type Access = {
  id: string;
  userId: string;
  user?: User;
  softwareId: string;
  software?: Software;
  createdAt: string;
  updatedAt: string;
  stateRequest: "pending" | "accepted" | "rejected";
};
