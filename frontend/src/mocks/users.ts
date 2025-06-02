import type { roles } from "@/types/roles";
import type { User } from "@/types/user";

export function getUser(
  userName: string,
  role: roles,
  isActive: boolean = true
): User {
  return {
    id: "1234567890",
    name: userName,
    email: `${userName.toLowerCase().replace(/\s+/g, "")}@example.com`,
    role,
    area: "Engineering",
    team: "Development",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: isActive,
  };
}
