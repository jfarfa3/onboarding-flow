import type { User } from "@/types/user";
import { httpRequest } from "./http";

const API_BASE = import.meta.env.VITE_API_URL;

export async function createUser(user: User): Promise<User> {
  return httpRequest<User, User>(`${API_BASE}users`, user, {
    method: "POST",
  });
}

export async function updateUser(user: Partial<User>, userId?: string): Promise<User> {
  if (!userId) {
    throw new Error("User ID is required for update");
  }
  return httpRequest<Partial<User>, User>(`${API_BASE}users/${userId}`, user, {
    method: "PUT",
  });
}

export async function getUserById(userId: string): Promise<User> {
  return httpRequest<null, User>(`${API_BASE}users/${userId}`, null, {
    method: "GET",
  });
}

