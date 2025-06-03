import type { User } from "@/types/user";
import { httpRequest } from "./http";

const API_BASE = import.meta.env.VITE_API_URL;

export async function createUser(user: User): Promise<User> {
  return httpRequest<User, User>(`${API_BASE}users`, user, {
    method: "POST",
  });
}
