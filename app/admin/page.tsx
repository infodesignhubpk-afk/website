import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { listBlogPosts } from "@/lib/admin/blogs";
import { listProducts } from "@/lib/admin/products";
import { listCategories } from "@/lib/admin/categories";
import { listOrders } from "@/lib/admin/orders";
import { r2Configured } from "@/lib/r2";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const authed = await isAuthenticated();
  if (!authed) {
    return (
      <div className="grid min-h-[calc(100vh-4rem)] place-items-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-bg p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Design Hub</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-sm text-ink-soft">Enter the admin passcode to continue.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }

  const [posts, products, categories, orders] = await Promise.all([
    listBlogPosts(),
    listProducts(),
    listCategories(),
    listOrders(),
  ]);

  const stats = [
    { label: "Blog posts", value: posts.length, href: "/admin/blogs" },
    { label: "Products", value: products.length, href: "/admin/products" },
    { label: "Categories", value: categories.length, href: "/admin/categories" },
    { label: "Orders (all)", value: orders.length, href: "/admin/orders" },
    { label: "New orders", value: orders.filter((o) => o.status === "new").length, href: "/admin/orders" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">Welcome</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Dashboard</h1>
      </div>

      {!r2Configured ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm">
          <p className="font-semibold text-amber-900">Cloudflare R2 is not fully configured.</p>
          <p className="mt-1 text-amber-900">
            Set <code>R2_ACCOUNT_ID</code>, <code>R2_ACCESS_KEY_ID</code>, <code>R2_SECRET_ACCESS_KEY</code>, <code>R2_BUCKET</code> and (optionally) <code>R2_PUBLIC_BASE_URL</code> in <code>.env.local</code> to enable image uploads in Products and Media.
          </p>
        </div>
      ) : null}

      <ul className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className="block rounded-2xl border border-line bg-bg p-5 transition-colors hover:border-ink"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">{s.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{s.value}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-bg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink">View all</Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold">{o.reference} · {o.customerName}</p>
                  <p className="text-xs text-muted">{o.items.length} item · {o.currency} {o.totalAmount.toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  o.status === "new" ? "bg-brand text-ink" :
                  o.status === "fulfilled" ? "bg-ink text-bg" :
                  o.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-surface text-ink"
                }`}>
                  {o.status.replace("_", " ")}
                </span>
              </li>
            ))}
            {orders.length === 0 ? <li className="py-8 text-center text-sm text-muted">No orders yet.</li> : null}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-bg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Recent products</h2>
            <Link href="/admin/products" className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink">View all</Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {products.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted">{p.currency} {p.price.toLocaleString()} · {p.published ? "Published" : "Draft"}</p>
                </div>
                <Link href={`/admin/products/${p.id}`} className="text-xs font-semibold underline">Edit</Link>
              </li>
            ))}
            {products.length === 0 ? <li className="py-8 text-center text-sm text-muted">No products yet.</li> : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
