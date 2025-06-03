import type { User } from "@/types/user";
import { httpRequest } from "./http";

export async function createUser(user: User): Promise<User> {
  const url = 'http://localhost:8000/users';
  return httpRequest<User, User>(url, user, {
    method: 'POST',
  });
}