import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "dh_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function tokenFor(passcode: string): string {
  const secret = process.env.ADMIN_PASSCODE ?? "";
  return crypto.createHmac("sha256", secret).update(passcode).digest("hex");
}

export async function isAuthenticated(): Promise<boolean> {
  const passcode = process.env.ADMIN_PASSCODE;
  if (!passcode) return false;
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === tokenFor(passcode);
}

export async function login(input: string): Promise<boolean> {
  const passcode = process.env.ADMIN_PASSCODE;
  if (!passcode) return false;
  if (input.trim() !== passcode) return false;
  const c = await cookies();
  c.set(COOKIE_NAME, tokenFor(passcode), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logout(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
}
