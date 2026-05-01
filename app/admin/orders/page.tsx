import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listOrders } from "@/lib/admin/orders";
import { PageTitle } from "@/components/admin/AdminUI";
import { OrderRowActions } from "@/components/admin/OrderRowActions";
import { DELIVERY_LABELS, PAYMENT_LABELS } from "@/lib/orderValidation";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  new: "bg-brand text-ink",
  in_progress: "bg-surface text-ink",
  fulfilled: "bg-ink text-bg",
  cancelled: "bg-red-50 text-red-800",
};

export default async function AdminOrdersPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const orders = await listOrders();
  return (
    <div className="space-y-8">
      <PageTitle
        title="Orders"
        description="Customer orders captured from the public storefront. Update status as they move through fulfilment."
      />
      <div className="overflow-hidden rounded-2xl border border-line bg-bg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface">
            <tr>
              <th className="px-5 py-3 font-semibold">Reference</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Items</th>
              <th className="px-5 py-3 font-semibold">Delivery</th>
              <th className="px-5 py-3 font-semibold">Payment</th>
              <th className="px-5 py-3 font-semibold">Total</th>
              <th className="px-5 py-3 font-semibold">Created</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-5 py-4 font-mono text-xs">{o.reference}</td>
                <td className="px-5 py-4">
                  <p className="font-semibold">{o.customerName}</p>
                  <p className="text-xs text-muted">{o.customerPhone}</p>
                </td>
                <td className="px-5 py-4 text-xs text-ink-soft">{o.items.length} item{o.items.length === 1 ? "" : "s"}</td>
                <td className="px-5 py-4 text-xs text-ink-soft">{DELIVERY_LABELS[o.deliveryMethod] ?? o.deliveryMethod}</td>
                <td className="px-5 py-4 text-xs text-ink-soft">{PAYMENT_LABELS[o.paymentMethod] ?? o.paymentMethod}</td>
                <td className="px-5 py-4 text-sm font-semibold">{o.currency} {o.totalAmount.toLocaleString()}</td>
                <td className="px-5 py-4 text-xs text-muted" suppressHydrationWarning>{new Date(o.createdAt).toISOString().slice(0, 16).replace("T", " ")}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[o.status] ?? "bg-surface"}`}>
                    {o.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <OrderRowActions id={o.id} status={o.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr><td colSpan={9} className="px-5 py-12 text-center text-muted">No orders yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
