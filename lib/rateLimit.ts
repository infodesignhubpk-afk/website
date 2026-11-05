import "server-only";
import crypto from "crypto";
import { d1Configured, d1Exec, d1First, nowMs } from "@/lib/db";

// Fixed-window counters kept in D1 so every serverless instance shares them.
// A window starts at a multiple of its length, so counts reset on the boundary
// rather than sliding: an attacker gets at most twice the limit across one
// boundary, which is fine for abuse limits.

let tableEnsured = false;

async function ensureTable(): Promise<void> {
  if (tableEnsured) return;
  await d1Exec(
    `CREATE TABLE IF NOT EXISTS rate_limits (
      bucket TEXT NOT NULL,
      key TEXT NOT NULL,
      window_start INTEGER NOT NULL,
      count INTEGER NOT NULL,
      PRIMARY KEY (bucket, key, window_start)
    )`,
  );
  tableEnsured = true;
}

function windowStart(windowSec: number, now: number): number {
  const ms = windowSec * 1000;
  return now - (now % ms);
}

export type RateLimitCount = {
  /** Hits in the current window, including this one for `hit`. */
  count: number;
  /** Seconds until the current window ends. */
  retryAfterSec: number;
};

/** Hashes an identifier (an IP, say) so raw values are never stored. */
export function rateLimitKey(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 32);
}

/**
 * Records one hit for bucket/key and returns the window's new total.
 * Throws when D1 is unavailable; callers decide whether to fail open or closed.
 */
export async function hit(bucket: string, key: string, windowSec: number): Promise<RateLimitCount> {
  if (!d1Configured) throw new Error("Rate limiting needs D1.");
  await ensureTable();
  const now = nowMs();
  const start = windowStart(windowSec, now);
  const row = await d1First<{ count: number }>(
    `INSERT INTO rate_limits (bucket, key, window_start, count) VALUES (?, ?, ?, 1)
     ON CONFLICT (bucket, key, window_start) DO UPDATE SET count = count + 1
     RETURNING count`,
    [bucket, key, start],
  );
  // Old windows are never read again; sweep them now and then.
  if (Math.random() < 0.02) {
    d1Exec("DELETE FROM rate_limits WHERE window_start < ?", [now - 86_400_000]).catch(() => {});
  }
  return { count: Number(row?.count ?? 1), retryAfterSec: Math.ceil((start + windowSec * 1000 - now) / 1000) };
}

/** Returns the current window's total for bucket/key without adding to it. */
export async function peek(bucket: string, key: string, windowSec: number): Promise<RateLimitCount> {
  if (!d1Configured) throw new Error("Rate limiting needs D1.");
  await ensureTable();
  const now = nowMs();
  const start = windowStart(windowSec, now);
  const row = await d1First<{ count: number }>(
    "SELECT count FROM rate_limits WHERE bucket = ? AND key = ? AND window_start = ?",
    [bucket, key, start],
  );
  return { count: Number(row?.count ?? 0), retryAfterSec: Math.ceil((start + windowSec * 1000 - now) / 1000) };
}

/** Clears bucket/key in the current window (e.g. after a successful login). */
export async function reset(bucket: string, key: string, windowSec: number): Promise<void> {
  if (!d1Configured) return;
  await ensureTable();
  await d1Exec("DELETE FROM rate_limits WHERE bucket = ? AND key = ? AND window_start = ?", [
    bucket,
    key,
    windowStart(windowSec, nowMs()),
  ]);
}
