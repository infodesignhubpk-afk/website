import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listProducts } from "@/lib/admin/products";
import { listCategories } from "@/lib/admin/categories";
import { AdminButton, PageTitle } from "@/components/admin/AdminUI";
import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { PlusIcon, ExternalIcon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="space-y-8">
      <PageTitle
        title="Products"
        description="Items shown on /products. Drafts and out-of-stock items remain editable here."
        actions={
          <Link href="/admin/products/new">
            <AdminButton variant="primary"><PlusIcon size={16} /> New product</AdminButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-bg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface">
            <tr>
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 font-semibold">Categories</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface">
                      {p.images[0] ? (
                        <Image src={p.images[0]} alt={p.name} width={48} height={48} className="h-full w-full object-cover" unoptimized />
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <a href={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted hover:text-ink">
                        /products/{p.slug} <ExternalIcon size={12} />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs">
                  {p.categoryIds.length === 0 ? <span className="text-muted">—</span> : p.categoryIds.map(catName).join(", ")}
                </td>
                <td className="px-5 py-4 text-sm font-semibold">{p.currency} {p.price.toLocaleString()}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.published ? "bg-brand text-ink" : "bg-surface text-ink-soft"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                    <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.inStock ? "bg-surface text-ink" : "bg-red-50 text-red-800"}`}>
                      {p.inStock ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <ProductRowActions id={p.id} />
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-muted">No products yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
