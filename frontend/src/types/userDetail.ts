import type { Access } from "./access";
import type { Devices } from "./devices";
import type { User } from "./user";

export type UserDetail = {
  user: User;
  devices: Devices[];
  access: Access[];
};
