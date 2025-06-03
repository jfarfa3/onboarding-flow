import type { User } from "@/types/user";

export function getUser(
  userName: string,
  role_id: string,
  isActive: boolean = true
): User {
  return {
    id: "1234567890",
    name: userName,
    email: `${userName.toLowerCase().replace(/\s+/g, "")}@example.com`,
    role_id: role_id,
    area: "Engineering",
    team: "Development",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    is_active: isActive,
  };
}
