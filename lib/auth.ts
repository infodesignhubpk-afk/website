import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import crypto from "crypto";
import {
  SESSION_TTL_SEC,
  createSession,
  deleteAllSessions,
  deleteSession,
  sessionValid,
} from "@/lib/admin/sessions";

const COOKIE_NAME = "dh_admin";

// Below this the admin shell nags the owner to set a longer ADMIN_PASSCODE.
const RECOMMENDED_PASSCODE_LENGTH = 16;

/** Constant-time compare: hashing first makes both sides the same length. */
function passcodeMatches(input: string, passcode: string): boolean {
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(passcode).digest();
  return crypto.timingSafeEqual(a, b);
}

/**
 * Whether this request carries a live admin session. Cached per request so a
 * page and its layout share one D1 lookup. Fails closed: any D1 error, or a
 * missing ADMIN_PASSCODE, means signed out.
 */
export const isAuthenticated = cache(async (): Promise<boolean> => {
  const passcode = process.env.ADMIN_PASSCODE;
  if (!passcode) return false;
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    return await sessionValid(token, passcode);
  } catch (err) {
    console.warn("[auth] session check failed:", err);
    return false;
  }
});

/**
 * Checks the passcode and, if it matches, starts a session. Returns false for
 * a wrong passcode; throws when the session cannot be stored (D1 unavailable).
 */
export async function login(input: string): Promise<boolean> {
  const passcode = process.env.ADMIN_PASSCODE;
  if (!passcode) return false;
  if (!passcodeMatches(input.trim(), passcode)) return false;
  const token = await createSession(passcode);
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
  return true;
}

export async function logout(): Promise<void> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await deleteSession(token);
    } catch (err) {
      // The cookie still goes; the row lapses at its expiry.
      console.warn("[auth] session delete failed:", err);
    }
  }
  c.delete(COOKIE_NAME);
}

/** Ends every admin session, this one included. Throws when D1 is unavailable. */
export async function logoutEverywhere(): Promise<void> {
  const passcode = process.env.ADMIN_PASSCODE;
  if (passcode) await deleteAllSessions(passcode);
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

/** True when ADMIN_PASSCODE is set but shorter than we would like. */
export function passcodeIsWeak(): boolean {
  const passcode = process.env.ADMIN_PASSCODE;
  if (!passcode) return false;
  return passcode.length < RECOMMENDED_PASSCODE_LENGTH;
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
}
