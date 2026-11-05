const FALLBACK_ERROR = "Something went wrong. Please try again or WhatsApp us.";

export type LeadResult = { ok: true } | { ok: false; message: string };

/**
 * Posts a lead form to /api/lead. On failure it returns the API's own message
 * (rate limit, too long, check your details), which is always written for
 * visitors, or a fallback when the response is not the API's JSON.
 */
export async function submitLead(body: Record<string, unknown>): Promise<LeadResult> {
  let res: Response;
  try {
    res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, message: FALLBACK_ERROR };
  }
  if (res.ok) return { ok: true };

  let message = FALLBACK_ERROR;
  try {
    const data: unknown = await res.json();
    if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string" && data.error) {
      message = data.error;
    }
  } catch {
    // Not JSON (a platform error page, say): keep the fallback.
  }
  return { ok: false, message };
}
