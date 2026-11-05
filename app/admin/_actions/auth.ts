"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAuthenticated, login, logout, logoutEverywhere } from "@/lib/auth";
import { clientIp } from "@/lib/http";
import { LOGIN_WINDOW_SEC, loginLocked } from "@/lib/loginPolicy";
import { hit, peek, rateLimitKey, reset } from "@/lib/rateLimit";

export type AuthResult = { error?: string; ok?: boolean };

const IP_BUCKET = "admin-login-ip";
const GLOBAL_BUCKET = "admin-login-all";
const GLOBAL_KEY = "all";

const UNAVAILABLE = "Login is temporarily unavailable. Please try again shortly.";

function tooManyAttempts(retryAfterSec: number): AuthResult {
  const minutes = Math.max(1, Math.ceil(retryAfterSec / 60));
  return { error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` };
}

export async function loginAction(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const passcode = String(formData.get("passcode") ?? "");
  const ipKey = rateLimitKey(clientIp(await headers()));

  // Fails closed: if the attempt counters cannot be read or written, nobody
  // gets to guess.
  let ok: boolean;
  try {
    const [ipSeen, allSeen] = await Promise.all([
      peek(IP_BUCKET, ipKey, LOGIN_WINDOW_SEC),
      peek(GLOBAL_BUCKET, GLOBAL_KEY, LOGIN_WINDOW_SEC),
    ]);
    if (loginLocked(ipSeen.count, allSeen.count)) {
      return tooManyAttempts(Math.max(ipSeen.retryAfterSec, allSeen.retryAfterSec));
    }

    // Count the attempt before checking the passcode. Each increment is atomic,
    // so a burst of parallel requests that all passed the peek above is still
    // cut off at the limit rather than each getting a free guess. The IP bucket
    // goes first and the global one only for attempts inside this IP's limit,
    // so no single IP can add more than its own allowance to the global count.
    const ipNow = await hit(IP_BUCKET, ipKey, LOGIN_WINDOW_SEC);
    if (loginLocked(ipNow.count - 1, allSeen.count)) {
      return tooManyAttempts(ipNow.retryAfterSec);
    }
    const allNow = await hit(GLOBAL_BUCKET, GLOBAL_KEY, LOGIN_WINDOW_SEC);
    if (loginLocked(ipNow.count - 1, allNow.count - 1)) {
      return tooManyAttempts(Math.max(ipNow.retryAfterSec, allNow.retryAfterSec));
    }

    ok = await login(passcode);
  } catch (err) {
    console.warn("[auth] login unavailable:", err);
    return { error: UNAVAILABLE };
  }
  if (!ok) return { error: "Incorrect passcode." };

  try {
    await reset(IP_BUCKET, ipKey, LOGIN_WINDOW_SEC);
  } catch (err) {
    console.warn("[auth] login counter reset failed:", err);
  }
  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  revalidatePath("/admin");
}

export async function signOutAllAction(): Promise<AuthResult> {
  // Returns rather than throws: a stale tab whose session already ended
  // should land on the login form, not the admin error page.
  if (!(await isAuthenticated())) {
    return { error: "Your session has already ended. Please sign in again." };
  }
  try {
    await logoutEverywhere();
  } catch (err) {
    console.warn("[auth] sign out all devices failed:", err);
    return { error: "Could not sign out all devices. Please try again." };
  }
  revalidatePath("/admin");
  return { ok: true };
}
