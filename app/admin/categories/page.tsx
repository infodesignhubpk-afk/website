import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/admin/categories";
import { AdminButton, PageTitle } from "@/components/admin/AdminUI";
import { CategoryRowActions } from "@/components/admin/CategoryRowActions";
import { PlusIcon } from "@/components/ui/Icons";
import { richTextToPlainText } from "@/lib/sanitize";

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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] table-fixed text-left text-sm">
            <thead className="border-b border-line bg-surface">
              <tr>
                <th className="w-[46%] px-5 py-3 font-semibold">Name</th>
                <th className="w-[22%] px-5 py-3 font-semibold">Slug</th>
                <th className="w-[10%] px-5 py-3 font-semibold">Order</th>
                <th className="w-[22%] px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {categories.map((c) => {
                const description = richTextToPlainText(c.description);
                return (
                  <tr key={c.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-semibold leading-5">{c.name}</p>
                      {description ? (
                        <p className="mt-1 line-clamp-2 max-w-full break-words text-xs leading-5 text-muted">
                          {description}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-muted">No description.</p>
                      )}
                    </td>
                    <td className="break-all px-5 py-4 font-mono text-xs text-ink-soft">{c.slug}</td>
                    <td className="px-5 py-4 text-sm tabular-nums">{c.order}</td>
                    <td className="px-5 py-4 text-right">
                      <CategoryRowActions id={c.id} />
                    </td>
                  </tr>
                );
              })}
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-muted">
                    No categories. Add one to organise products.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
