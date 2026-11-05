import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo";
import { getOrderByReference } from "@/lib/admin/orders";
import { verifyOrderToken } from "@/lib/orderToken";
import { getSite } from "@/lib/admin/site";
import { CheckIcon, ArrowRightIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink } from "@/lib/utils";
import { DELIVERY_LABELS, ORDER_REFERENCE_PATTERN, PAYMENT_LABELS } from "@/lib/orderValidation";
import { formatAmount, lineTotal } from "@/lib/money";
import type { Order } from "@/types/admin";

export const metadata: Metadata = buildMetadata({
  title: "Order received | Design Hub",
  description: "Your order has been received.",
  path: "/checkout/success",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string | string[]; t?: string | string[] }>;
}) {
  const sp = await searchParams;
  // Only a reference in the generated format is shown or echoed. Anything else
  // (say a crafted ?ref= sentence with "payment instructions") gets the generic
  // state, so this page cannot be used to put a scammer's words on our domain.
  const ref = typeof sp.ref === "string" && ORDER_REFERENCE_PATTERN.test(sp.ref) ? sp.ref : "";
  // The summary below contains the customer name, phone number and delivery
  // address. Only render it for someone holding the token issued at checkout —
  // never for anyone who simply knows or guesses a reference. No token (e.g.
  // ORDER_TOKEN_SECRET unset) or a failed lookup still shows the reference.
  const authorized = ref !== "" && verifyOrderToken(ref, typeof sp.t === "string" ? sp.t : undefined);
  let order: Order | null = null;
  if (authorized) {
    try {
      order = await getOrderByReference(ref);
    } catch (err) {
      console.error("[checkout/success] order lookup failed:", err);
    }
  }
  const site = await getSite();

  return (
    <Section surface="white" className="pt-8 pb-16 md:pt-12 md:pb-20">
      <Container>
        {ref ? (
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-ink">
              <CheckIcon size={28} />
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">Thank you — your order is in.</h1>
            <p className="mt-4 text-base md:text-xl leading-relaxed text-ink-soft">
              Reference <span className="font-mono font-bold text-ink">{ref}</span>. A project manager will contact
              you within one working day to confirm details and share payment instructions.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Order confirmation</h1>
            <p className="mt-4 text-base md:text-xl leading-relaxed text-ink-soft">
              This link does not include a valid order reference. If you have just placed an order, a project
              manager will contact you within one working day, or message us on WhatsApp and we will look it up.
            </p>
          </div>
        )}

        {order ? (
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-line bg-bg p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-tight">Order summary</h2>
            <ul className="mt-4 divide-y divide-line">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{it.productName}</p>
                    <p className="text-xs text-muted">× {it.quantity} · {it.currency} {formatAmount(it.unitPrice)} each</p>
                  </div>
                  <p className="font-semibold">{it.currency} {formatAmount(lineTotal(it.quantity, it.unitPrice))}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold">{order.currency} {formatAmount(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Delivery ({DELIVERY_LABELS[order.deliveryMethod]})</dt>
                <dd className="font-semibold">{order.currency} {formatAmount(order.deliveryFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd>{order.currency} {formatAmount(order.totalAmount)}</dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-4 border-t border-line pt-6 text-sm md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Delivery</p>
                <p className="mt-1 font-semibold">{DELIVERY_LABELS[order.deliveryMethod]}</p>
                {order.deliveryAddress ? (
                  <p className="mt-1 text-ink-soft">
                    {order.deliveryAddress.street}
                    {order.deliveryAddress.city ? <>, {order.deliveryAddress.city}</> : null}
                    {order.deliveryAddress.postalCode ? <> {order.deliveryAddress.postalCode}</> : null}
                  </p>
                ) : null}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Payment</p>
                <p className="mt-1 font-semibold">{PAYMENT_LABELS[order.paymentMethod]}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Customer</p>
                <p className="mt-1 font-semibold">{order.customerName}</p>
                <p className="text-ink-soft">{order.customerPhone}</p>
              </div>
              {order.notes ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">Notes</p>
                  <p className="mt-1 whitespace-pre-wrap text-ink-soft">{order.notes}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : ref ? (
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
            For your security, order details are not shown on this page. Quote your reference to us on WhatsApp
            and we will confirm everything with you.
          </p>
        ) : null}

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-base font-semibold text-bg hover:bg-ink-soft"
          >
            Continue shopping
            <ArrowRightIcon size={16} />
          </Link>
          <a
            href={whatsappLink(site.whatsappNumber, ref ? `Hi, just placed order ${ref}.` : "Hi, just placed an order.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-6 py-3 text-base font-semibold hover:border-ink"
          >
            <WhatsAppIcon size={18} /> WhatsApp us
          </a>
        </div>
      </Container>
    </Section>
  );
}
