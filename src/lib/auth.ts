import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function token() {
  const secret = process.env.ADMIN_SECRET || "pulsebuds-secret-" + adminPassword();
  return createHmac("sha256", secret).update("admin:" + adminPassword()).digest("hex");
}

export function sessionToken() {
  return token();
}

export function checkPassword(pw: string) {
  const a = Buffer.from(pw);
  const b = Buffer.from(adminPassword());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === token();
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}
