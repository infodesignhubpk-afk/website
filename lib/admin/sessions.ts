import "server-only";
import crypto from "crypto";
import { d1Exec, d1First, nowMs } from "@/lib/db";

// Server-side admin sessions. The cookie holds a random token; D1 holds only
// its SHA-256, so a leaked table cannot be replayed as cookies. Every function
// here throws when D1 is unavailable; lib/auth.ts decides how to fail.

export const SESSION_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

// 32 random bytes, base64url-encoded without padding.
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

// Fixed salt: the fingerprint only has to be stable for one passcode and slow
// to brute-force if the table leaks, not unique per row.
const FINGERPRINT_SALT = "designhub:admin-session:v1";

let tableEnsured = false;

async function ensureTable(): Promise<void> {
  if (tableEnsured) return;
  await d1Exec(
    `CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash TEXT PRIMARY KEY,
      passcode_fp TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    )`,
  );
  await d1Exec("CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at)");
  tableEnsured = true;
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ADMIN_PASSCODE only changes with a redeploy, so scrypt runs once per process.
let fingerprintMemo: { passcode: string; fp: string } | null = null;

/**
 * Ties a session to the passcode it was issued under: rotating ADMIN_PASSCODE
 * changes the fingerprint, so every existing session stops validating.
 */
function passcodeFingerprint(passcode: string): string {
  if (fingerprintMemo?.passcode !== passcode) {
    const fp = crypto.scryptSync(passcode, FINGERPRINT_SALT, 32).toString("hex");
    fingerprintMemo = { passcode, fp };
  }
  return fingerprintMemo.fp;
}

/** Stores a new session and returns the cookie token. */
export async function createSession(passcode: string): Promise<string> {
  await ensureTable();
  const token = crypto.randomBytes(32).toString("base64url");
  const fp = passcodeFingerprint(passcode);
  const now = nowMs();
  await d1Exec(
    "INSERT INTO admin_sessions (token_hash, passcode_fp, created_at, expires_at) VALUES (?, ?, ?, ?)",
    [hashToken(token), fp, now, now + SESSION_TTL_SEC * 1000],
  );
  // Expired sessions can never validate again; logins are rare, so sweep them
  // here. Rows under another passcode are left to expire: local dev, preview
  // and production share one D1 database, so those may be another
  // environment's live sessions.
  try {
    await d1Exec("DELETE FROM admin_sessions WHERE expires_at <= ?", [now]);
  } catch (err) {
    console.warn("[sessions] cleanup failed:", err);
  }
  return token;
}

/** True when the token belongs to an unexpired session for this passcode. */
export async function sessionValid(token: string, passcode: string): Promise<boolean> {
  // Malformed values (including cookies from the old scheme) skip the lookup.
  if (!TOKEN_PATTERN.test(token)) return false;
  await ensureTable();
  const row = await d1First<{ expires_at: number }>(
    "SELECT expires_at FROM admin_sessions WHERE token_hash = ? AND passcode_fp = ? AND expires_at > ?",
    [hashToken(token), passcodeFingerprint(passcode), nowMs()],
  );
  return row !== null;
}

export async function deleteSession(token: string): Promise<void> {
  if (!TOKEN_PATTERN.test(token)) return;
  await ensureTable();
  await d1Exec("DELETE FROM admin_sessions WHERE token_hash = ?", [hashToken(token)]);
}

/**
 * Signs out every device signed in under this passcode, the caller's included.
 * Sessions under another passcode cannot validate here anyway, and may belong
 * to another environment sharing this D1 database, so they are left alone.
 */
export async function deleteAllSessions(passcode: string): Promise<void> {
  await ensureTable();
  await d1Exec("DELETE FROM admin_sessions WHERE passcode_fp = ?", [passcodeFingerprint(passcode)]);
}
