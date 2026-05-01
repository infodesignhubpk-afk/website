import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/admin/categories";
import { AdminButton, PageTitle } from "@/components/admin/AdminUI";
import { CategoryRowActions } from "@/components/admin/CategoryRowActions";
import { PlusIcon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const categories = await listCategories();
  return (
    <div className="space-y-8">
      <PageTitle
        title="Categories"
        description="Group products on the public storefront."
        actions={
          <Link href="/admin/categories/new">
            <AdminButton variant="primary"><PlusIcon size={16} /> New category</AdminButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-bg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface">
            <tr>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Slug</th>
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-4">
                  <p className="font-semibold">{c.name}</p>
                  <p className="mt-0.5 text-xs text-muted line-clamp-1">{c.description}</p>
                </td>
                <td className="px-5 py-4 text-xs font-mono text-ink-soft">{c.slug}</td>
                <td className="px-5 py-4 text-sm">{c.order}</td>
                <td className="px-5 py-4 text-right">
                  <CategoryRowActions id={c.id} />
                </td>
              </tr>
            ))}
            {categories.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-muted">No categories. Add one to organise products.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
