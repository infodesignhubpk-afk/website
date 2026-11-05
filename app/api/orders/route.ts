import { NextResponse, after } from "next/server";
import {
  MAX_ORDER_ITEMS,
  deliveryFeeFor,
  orderAmountOk,
  orderRequestSchema,
  orderTotals,
} from "@/lib/orderValidation";
import { createOrder } from "@/lib/admin/orders";
import { getProductsByIds } from "@/lib/admin/products";
import { signOrderToken } from "@/lib/orderToken";
import { sendOrderNotificationEmail } from "@/lib/email";
import { clientIp, readJsonBody } from "@/lib/http";
import { hit, rateLimitKey } from "@/lib/rateLimit";
import { formatAmount } from "@/lib/money";
import type { AdminProduct, Order, OrderItem } from "@/types/admin";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT_WINDOW_SEC = 600;
const RATE_LIMIT_MAX = 10;
const MAX_ERROR_FIELDS = 10;
const WEBHOOK_TIMEOUT_MS = 8000;

const GENERIC_ERROR = "We could not place your order. Please try again or WhatsApp us.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function priceOk(product: AdminProduct): boolean {
  return typeof product.price === "number" && Number.isFinite(product.price) && product.price >= 0;
}

/** True when the Content-Type media type is application/json (parameters such as charset are ignored). */
function isJsonRequest(headers: Headers): boolean {
  const mediaType = headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  return mediaType === "application/json";
}

type UnavailableLine = { productId: string; productName: string };
type RepricedLine = { productId: string; productSlug: string; productName: string; unitPrice: number; currency: string };

function conflictMessage(unavailable: UnavailableLine[], repriced: RepricedLine[]): string {
  const parts: string[] = [];
  if (unavailable.length > 0) {
    const one = unavailable.length === 1;
    parts.push(
      `Sorry, ${unavailable.map((u) => u.productName).join(", ")} ${one ? "is" : "are"} no longer available. Please remove ${
        one ? "it" : "them"
      } from your cart and try again.`,
    );
  }
  if (repriced.length > 0) {
    const priced = (r: RepricedLine) => `${r.currency} ${formatAmount(r.unitPrice)}`;
    parts.push(
      repriced.length === 1
        ? `The price of ${repriced[0].productName} has changed to ${priced(repriced[0])}.`
        : `Prices have changed: ${repriced.map((r) => `${r.productName} is now ${priced(r)}`).join(", ")}.`,
      "Please check the new total and place your order again.",
    );
  }
  return parts.join(" ");
}

export async function POST(req: Request) {
  // Cross-site guard, checked before anything else so a forged request cannot
  // use up a visitor's allowance. Another site's page can only POST here
  // without a CORS preflight as a "simple request" (text/plain or a form
  // type); requiring application/json forces a preflight this route never
  // approves. Sec-Fetch-Site is set by the browser and cannot be forged by a page.
  if (!isJsonRequest(req.headers)) {
    return NextResponse.json(
      { error: "Please place your order from our checkout page, or WhatsApp us." },
      { status: 415 },
    );
  }
  if (req.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
  }

  const body = await readJsonBody(req, MAX_BODY_BYTES);
  if (!body.ok) {
    const error = body.status === 413 ? "This order is too large to send online. Please WhatsApp us." : GENERIC_ERROR;
    return NextResponse.json({ error }, { status: body.status });
  }
  const payload = body.value;

  // Honeypot: a filled one (of any type) gets the same reply as before, without
  // validation errors that would tell a bot what to change.
  if (isRecord(payload) && payload.website !== undefined && payload.website !== null && payload.website !== "") {
    return NextResponse.json({ ok: true });
  }

  // Checked before safeParse so an oversized array is never validated item by item.
  if (isRecord(payload) && Array.isArray(payload.items) && payload.items.length > MAX_ORDER_ITEMS) {
    return NextResponse.json(
      {
        error: `An order can hold at most ${MAX_ORDER_ITEMS} different products. Please split it or WhatsApp us.`,
        fields: ["items"],
      },
      { status: 400 },
    );
  }

  const parsed = orderRequestSchema.safeParse(payload);
  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((issue) => issue.path.map(String).join(".") || "(root)")),
    ].slice(0, MAX_ERROR_FIELDS);
    return NextResponse.json(
      { error: "Some order details are missing or invalid. Please check the form and try again.", fields },
      { status: 400 },
    );
  }

  // Counted only once the order is well-formed, so junk and bot requests never
  // spend a D1 call (Cloudflare API quota). Fails open when D1 is down:
  // createOrder needs D1 as well and will fail on its own.
  try {
    const { count, retryAfterSec } = await hit(
      "orders",
      rateLimitKey(clientIp(req.headers)),
      RATE_LIMIT_WINDOW_SEC,
    );
    if (count > RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Too many orders from your connection. Please wait a few minutes or WhatsApp us." },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
      );
    }
  } catch (err) {
    console.error("[orders] rate limit unavailable:", err);
  }

  const data = parsed.data;

  // Never trust the cart's name, slug, price or currency: rebuild every line
  // from the catalogue so a stale or crafted cart cannot set the price. A line
  // whose price or currency differs from the catalogue is refused rather than
  // silently repriced, so the customer never places an order for a total
  // other than the one they were shown.
  let products: AdminProduct[];
  try {
    products = await getProductsByIds(data.items.map((it) => it.productId));
  } catch (err) {
    console.error("[orders] product lookup failed:", err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
  const byId = new Map(products.map((p) => [p.id, p]));

  const items: OrderItem[] = [];
  const unavailable: UnavailableLine[] = [];
  const repriced: RepricedLine[] = [];
  for (const it of data.items) {
    const product = byId.get(it.productId);
    if (!product || !product.published || !product.inStock || !priceOk(product) || !product.currency) {
      // The cart's own name: it is what the customer recognises, and it does
      // not reveal the name of an unpublished product to someone guessing ids.
      unavailable.push({ productId: it.productId, productName: it.productName });
      continue;
    }
    if (it.unitPrice !== product.price || it.currency !== product.currency) {
      repriced.push({
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        unitPrice: product.price,
        currency: product.currency,
      });
    }
    items.push({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      quantity: it.quantity,
      unitPrice: product.price,
      currency: product.currency,
    });
  }

  // `repriced` carries the catalogue values so the checkout can update the
  // cart and show the real total before the customer submits again.
  if (unavailable.length > 0 || repriced.length > 0) {
    return NextResponse.json(
      { error: conflictMessage(unavailable, repriced), unavailable, repriced },
      { status: 409 },
    );
  }

  const currencies = [...new Set(items.map((it) => it.currency))];
  if (currencies.length > 1) {
    return NextResponse.json(
      {
        error: `These products are priced in different currencies (${currencies.join(", ")}). Please order them separately or WhatsApp us.`,
      },
      { status: 409 },
    );
  }

  const deliveryMethod = data.deliveryMethod ?? "pickup";
  const deliveryFee = deliveryFeeFor(deliveryMethod);
  const { subtotal, total } = orderTotals(items, deliveryFee);
  if (!orderAmountOk(subtotal) || !orderAmountOk(total)) {
    return NextResponse.json(
      { error: "This order is too large to place online. Please WhatsApp us and we will quote it directly." },
      { status: 400 },
    );
  }

  let order: Order;
  try {
    order = await createOrder({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      customerBusiness: data.customerBusiness || undefined,
      notes: data.notes || undefined,
      items,
      deliveryMethod,
      deliveryAddress: data.deliveryAddress
        ? {
            street: data.deliveryAddress.street ?? "",
            city: data.deliveryAddress.city ?? "",
            postalCode: data.deliveryAddress.postalCode || undefined,
            landmark: data.deliveryAddress.landmark || undefined,
          }
        : undefined,
      deliveryFee,
      paymentMethod: data.paymentMethod ?? "cod",
      source: (req.headers.get("origin") ?? "designhub.com.pk").slice(0, 200),
    });
  } catch (err) {
    // The underlying message can name D1 settings or env vars; keep it in the logs.
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  // The order is saved. Notifications run after the response so a slow mail
  // server or webhook can never turn it into a reported failure (and a retry
  // that duplicates it).
  after(() => notifyOrder(order));

  return NextResponse.json({
    ok: true,
    reference: order.reference,
    token: signOrderToken(order.reference),
    id: order.id,
  });
}

async function notifyOrder(order: Order): Promise<void> {
  const email = (async () => {
    try {
      await sendOrderNotificationEmail(order);
    } catch (err) {
      console.error("Failed to send order email notification:", err);
    }
  })();

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const hook = webhook
    ? (async () => {
        try {
          const res = await fetch(webhook, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(process.env.LEAD_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
            },
            body: JSON.stringify({ kind: "order", order }),
            signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
          });
          if (!res.ok) console.error("Order webhook responded with non-OK status:", res.status);
        } catch (err) {
          console.error("Order webhook failed:", err);
        }
      })()
    : Promise.resolve();

  await Promise.all([email, hook]);
}
