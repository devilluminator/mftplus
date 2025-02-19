import { SignJWT, jwtVerify, JWTPayload } from "jose";
const secretAccessKey: string = process.env.SESSION_SECRET_ACCESS_KEY!;
const secretRefreshKey: string = process.env.SESSION_SECRET_REFRESH_KEY!;

const access: Uint8Array<ArrayBufferLike> = new TextEncoder().encode(
  secretAccessKey,
);
const refresh: Uint8Array<ArrayBufferLike> = new TextEncoder().encode(
  secretRefreshKey,
);
const algorithm = "HS256";

//⭐ generating session tokens => access & refresh
export async function encrypt(
  payload: JWTPayload,
  type: string,
): Promise<string> {
  const key: Uint8Array<ArrayBufferLike> =
    type === "refresh" ? refresh : access;
  return new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(type === "refresh" ? "7d" : "15m")
    .sign(key);
}
// ⭐ decrypt & verifying tokens => both access & refresh
export async function decrypt(session: string, type: string) {
  const key: Uint8Array<ArrayBufferLike> =
    type === "refresh" ? refresh : access;
  const { payload } = await jwtVerify(session, key);
  return payload;
}
