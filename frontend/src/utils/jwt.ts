import type { DecodedJwtPayload } from "@/config/permissions";
import * as jose from "jose";

export async function decodeJwtAndCheckExpiration(token: string): Promise<DecodedJwtPayload> {
  try {
    const payload = jose.decodeJwt(token) as DecodedJwtPayload
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("JWT token has expired");
    }
    return payload;
  } catch {
    throw new Error("Invalid JWT token");
  }
}
