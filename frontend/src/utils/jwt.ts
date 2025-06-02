import * as jose from "jose";

export async function decodeJwtAndCheckExpiration(token: string): Promise<jose.JWTPayload> {
  try {
    const payload = jose.decodeJwt(token);
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("JWT token has expired");
    }
    return payload;
  } catch {
    throw new Error("Invalid JWT token");
  }
}
