import * as jose from "jose";
import type { User } from "@/types/user";
export const JWT_SECRET = "zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI";

const alg = "HS256";
const secret = new TextEncoder().encode(JWT_SECRET);

export async function generateJwt(user: User): Promise<string> {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role?.label,
  };

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("organization")
    .setAudience("application")
    .setExpirationTime("24h")
    .sign(secret);

  return jwt;
}
