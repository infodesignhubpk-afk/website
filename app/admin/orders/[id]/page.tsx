import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { getOrderById } from "@/lib/admin/orders";
import { PageTitle } from "@/components/admin/AdminUI";
import { OrderRowActions } from "@/components/admin/OrderRowActions";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { DELIVERY_LABELS, PAYMENT_LABELS } from "@/lib/orderValidation";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <PageTitle
        title={`Order ${order.reference}`}
        description={`Created ${new Date(order.createdAt).toISOString().slice(0, 16).replace("T", " ")} UTC`}
        actions={
          <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
            <ArrowRightIcon size={14} className="rotate-180" /> Back to orders
          </Link>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Items</h2>
            <ul className="mt-4 divide-y divide-line">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-semibold">{it.productName}</p>
                    <p className="text-xs text-muted">/{it.productSlug}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{it.quantity} × {it.currency} {it.unitPrice.toLocaleString()}</p>
                    <p className="text-xs text-muted">{it.currency} {(it.quantity * it.unitPrice).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold">{order.currency} {order.subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-soft">Delivery</dt>
                <dd className="font-semibold">{order.currency} {order.deliveryFee.toLocaleString()}</dd>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-line pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd>{order.currency} {order.totalAmount.toLocaleString()}</dd>
              </div>
            </dl>
          </section>

          {order.notes ? (
            <section className="rounded-2xl border border-line bg-bg p-6">
              <h2 className="text-lg font-semibold tracking-tight">Notes</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm text-ink-soft">{order.notes}</p>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Customer</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted">Name</dt>
                <dd className="mt-0.5 font-semibold">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted">Phone</dt>
                <dd className="mt-0.5">
                  <a href={`tel:${order.customerPhone}`} className="hover:underline">{order.customerPhone}</a>
                </dd>
              </div>
              {order.customerEmail ? (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted">Email</dt>
                  <dd className="mt-0.5">
                    <a href={`mailto:${order.customerEmail}`} className="hover:underline">{order.customerEmail}</a>
                  </dd>
                </div>
              ) : null}
              {order.customerBusiness ? (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted">Business</dt>
                  <dd className="mt-0.5">{order.customerBusiness}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Delivery</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted">Method</dt>
                <dd className="mt-0.5 font-semibold">{DELIVERY_LABELS[order.deliveryMethod] ?? order.deliveryMethod}</dd>
              </div>
              {order.deliveryAddress ? (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted">Address</dt>
                  <dd className="mt-0.5 text-ink-soft">
                    <p>{order.deliveryAddress.street}</p>
                    <p>{order.deliveryAddress.city}{order.deliveryAddress.postalCode ? ` ${order.deliveryAddress.postalCode}` : ""}</p>
                    {order.deliveryAddress.landmark ? <p className="text-muted">Landmark: {order.deliveryAddress.landmark}</p> : null}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted">Fee</dt>
                <dd className="mt-0.5">{order.currency} {order.deliveryFee.toLocaleString()}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Payment</h2>
            <p className="mt-4 text-sm font-semibold">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Status</h2>
            <div className="mt-4">
              <OrderRowActions id={order.id} status={order.status} />
            </div>
            <p className="mt-3 text-xs text-muted">Source: {order.source}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
