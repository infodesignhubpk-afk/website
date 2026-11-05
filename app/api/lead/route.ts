import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { sendLeadNotificationEmail } from "@/lib/email";
import { clientIp, readJsonBody } from "@/lib/http";
import { hit, rateLimitKey, type RateLimitCount } from "@/lib/rateLimit";

export const runtime = "nodejs";

// A lead form posts a few KB at most; the longest field is capped at 5000 characters.
const MAX_BODY_BYTES = 16 * 1024;
const LEAD_LIMIT = 6;
const LEAD_WINDOW_SEC = 10 * 60;
// Leads from all IPs together. The per-IP limit does nothing against a flood
// spread over many IPs (or many visitors' browsers), and every lead is an
// email from one Gmail account (about 500 a day). Any 24 hours overlap at most
// 25 hourly windows, so while D1 is up this caps lead email at 375 a day and
// leaves room for order emails, which use the same account.
const GLOBAL_LIMIT = 15;
const GLOBAL_WINDOW_SEC = 60 * 60;
const GLOBAL_KEY = "all";
const MAX_FIELD_PATHS = 10;
const LIMITER_TIMEOUT_MS = 3000;
const WEBHOOK_TIMEOUT_MS = 8000;

// Hits from one IP are also counted in this instance's memory. That count is
// checked first, so a flood from one IP is turned away without spending
// Cloudflare API quota (D1 runs over the REST API, and once the account's quota
// is used up every D1 call fails). It is also the per-IP limit while D1 is down.
type LocalWindow = { start: number; count: number };
const localCounts = new Map<string, LocalWindow>();
const MAX_LOCAL_KEYS = 5000;
// While D1 is down, this instance lets through at most this many leads per
// window from all IPs together, so a spread-out flood cannot run up the SMTP
// account's daily sending limit.
const FAIL_OPEN_LIMIT = 10;
let failOpenWindow: LocalWindow = { start: 0, count: 0 };
// Once D1 reports the global limit reached, this instance turns leads away
// until the window ends without asking D1 again, so a flood cannot spend the
// Cloudflare API quota either.
let globalBlockedUntil = 0;

// Same fixed windows as lib/rateLimit.ts, so both counts reset together.
function nextWindow(entry: LocalWindow | undefined, now: number): LocalWindow {
  const start = now - (now % (LEAD_WINDOW_SEC * 1000));
  return entry && entry.start === start ? { start, count: entry.count + 1 } : { start, count: 1 };
}

function asCount(entry: LocalWindow, now: number): RateLimitCount {
  return { count: entry.count, retryAfterSec: Math.ceil((entry.start + LEAD_WINDOW_SEC * 1000 - now) / 1000) };
}

function countLocally(key: string, now: number): RateLimitCount {
  const entry = nextWindow(localCounts.get(key), now);
  if (!localCounts.has(key) && localCounts.size >= MAX_LOCAL_KEYS) {
    for (const [k, e] of localCounts) if (e.start !== entry.start) localCounts.delete(k);
    // Still full: drop the oldest keys, which at worst restarts their counts.
    for (const k of localCounts.keys()) {
      if (localCounts.size < MAX_LOCAL_KEYS) break;
      localCounts.delete(k);
    }
  }
  localCounts.set(key, entry);
  return asCount(entry, now);
}

type SharedCounts = { ip: RateLimitCount; all: RateLimitCount | null };

// The global count is only added to for leads inside their IP's limit, so one
// IP cannot use up everyone's allowance.
async function hitShared(key: string): Promise<SharedCounts> {
  const ip = await hit("lead", key, LEAD_WINDOW_SEC);
  if (ip.count > LEAD_LIMIT) return { ip, all: null };
  return { ip, all: await hit("lead-all", GLOBAL_KEY, GLOBAL_WINDOW_SEC) };
}

/**
 * Counts this lead in D1, against the sender's IP and against all IPs. Returns
 * null when the limiter is down or slow: the lead then goes through (fail
 * open, within the local limits above), because a lost lead costs more than a
 * missed limit.
 */
async function countShared(key: string): Promise<SharedCounts | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("rate limiter timed out")), LIMITER_TIMEOUT_MS);
    });
    return await Promise.race([hitShared(key), timeout]);
  } catch (err) {
    console.error("[lead] rate limiter unavailable, allowing request:", err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function tooManyRequests(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    {
      error:
        "You have sent several requests in a short time. Please try again in a few minutes, or reach us on WhatsApp or by phone.",
    },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
  );
}

function siteBusy(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    {
      error:
        "We are receiving an unusually high number of requests right now. Please reach us on WhatsApp or by phone, or try again later.",
    },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
  );
}

/** Returns the 429 to send, or null when this lead is within the limits. */
async function limitLead(req: Request): Promise<NextResponse | null> {
  const key = rateLimitKey(clientIp(req.headers));
  const local = countLocally(key, Date.now());
  if (local.count > LEAD_LIMIT) return tooManyRequests(local.retryAfterSec);
  if (globalBlockedUntil > Date.now()) return siteBusy(Math.ceil((globalBlockedUntil - Date.now()) / 1000));

  const shared = await countShared(key);
  if (shared) {
    if (shared.ip.count > LEAD_LIMIT) return tooManyRequests(shared.ip.retryAfterSec);
    if (shared.all && shared.all.count > GLOBAL_LIMIT) {
      globalBlockedUntil = Date.now() + shared.all.retryAfterSec * 1000;
      return siteBusy(shared.all.retryAfterSec);
    }
    return null;
  }

  const now = Date.now();
  failOpenWindow = nextWindow(failOpenWindow, now);
  // This cap counts every visitor, so the message must not tell this one they sent several.
  return failOpenWindow.count > FAIL_OPEN_LIMIT ? siteBusy(asCount(failOpenWindow, now).retryAfterSec) : null;
}

/** True when the Content-Type media type is application/json (parameters such as charset are ignored). */
function isJsonRequest(headers: Headers): boolean {
  const mediaType = headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  return mediaType === "application/json";
}

function honeypotFilled(payload: unknown): boolean {
  if (typeof payload !== "object" || payload === null) return false;
  const value = (payload as Record<string, unknown>).website;
  return value !== undefined && value !== null && value !== "";
}

export async function POST(req: Request) {
  // Cross-site guard. Another site's page can only POST here without a CORS
  // preflight as a "simple request" (text/plain or a form type), so requiring
  // application/json forces a preflight this route never approves; otherwise
  // any page with traffic could make its visitors' browsers send leads, each
  // from its own IP. Sec-Fetch-Site is set by the browser and cannot be forged
  // by a page.
  if (!isJsonRequest(req.headers)) {
    return NextResponse.json(
      { error: "Please send your request from the form on our website, or reach us on WhatsApp." },
      { status: 415 },
    );
  }
  if (req.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  // Everything that can be turned away without D1 is, before the limiter
  // runs: only a valid lead spends Cloudflare API calls.
  const body = await readJsonBody(req, MAX_BODY_BYTES);
  if (!body.ok) {
    const error =
      body.status === 413
        ? "Your message is too long. Please shorten it, or send it to us on WhatsApp."
        : "Invalid request.";
    return NextResponse.json({ error }, { status: body.status });
  }

  // A filled honeypot gets the same answer as a real lead, so a bot cannot
  // tell it was caught.
  if (honeypotFilled(body.value)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadSchema.safeParse(body.value);
  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((issue) => issue.path.map(String).join(".")).filter(Boolean)),
    ].slice(0, MAX_FIELD_PATHS);
    return NextResponse.json(
      { error: "Please check your details and try again.", fields },
      { status: 400 },
    );
  }

  const limited = await limitLead(req);
  if (limited) return limited;

  const data = parsed.data;

  // Leads are not stored, so the email and the webhook are the only copies. A
  // lead that reached neither must not be reported as received: the visitor
  // is told to use WhatsApp or the phone instead.
  let delivered = false;

  // Send email notification to info.designhubpk@gmail.com
  try {
    const result = await sendLeadNotificationEmail(data);
    delivered = result.success;
  } catch (err) {
    console.error("Failed to send lead email notification:", err);
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const secret = process.env.LEAD_WEBHOOK_SECRET;

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(secret ? { "X-Webhook-Secret": secret } : {}),
        },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
          source: "designhub.com.pk",
          userAgent: req.headers.get("user-agent") ?? "",
        }),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });
      if (res.ok) {
        delivered = true;
      } else {
        console.error("Lead webhook responded with non-OK status:", res.status);
      }
    } catch (err) {
      console.error("Lead webhook failed:", err);
    }
  } else {
    console.warn("[lead] received but LEAD_WEBHOOK_URL is not configured");
  }

  if (!delivered) {
    console.error("[lead] not delivered by email or webhook; the visitor was asked to use WhatsApp or phone");
    return NextResponse.json(
      {
        error:
          "Sorry, we could not send your request just now. Please reach us on WhatsApp or by phone so it is not missed.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
