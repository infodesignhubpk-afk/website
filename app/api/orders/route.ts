import { NextResponse } from "next/server";
import { deliveryFeeFor, orderRequestSchema } from "@/lib/orderValidation";
import { createOrder } from "@/lib/admin/orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = orderRequestSchema.safeParse(payload);
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

  const order = await createOrder({
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail || undefined,
    customerBusiness: data.customerBusiness || undefined,
    notes: data.notes || undefined,
    items: data.items,
    deliveryMethod: data.deliveryMethod ?? "pickup",
    deliveryAddress: data.deliveryAddress
      ? {
          street: data.deliveryAddress.street,
          city: data.deliveryAddress.city,
          postalCode: data.deliveryAddress.postalCode || undefined,
          landmark: data.deliveryAddress.landmark || undefined,
        }
      : undefined,
    deliveryFee: deliveryFeeFor(data.deliveryMethod),
    paymentMethod: data.paymentMethod ?? "cod",
    source: req.headers.get("origin") ?? "designhub.pk",
  });

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEAD_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify({ kind: "order", order }),
      });
    } catch (err) {
      console.error("Order webhook failed:", err);
    }
  }

  return NextResponse.json({ ok: true, reference: order.reference, id: order.id });
}
