import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { sendLeadNotificationEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  // Send email notification to info.designhubpk@gmail.com
  try {
    await sendLeadNotificationEmail(data);
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
      });
      if (!res.ok) {
        console.error("Lead webhook responded with non-OK status:", res.status);
      }
    } catch (err) {
      console.error("Lead webhook failed:", err);
    }
  } else {
    console.warn("[lead] received but LEAD_WEBHOOK_URL is not configured");
  }

  return NextResponse.json({ ok: true });
}
