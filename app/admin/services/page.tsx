import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listServices } from "@/lib/admin/services";
import { AdminButton, PageTitle } from "@/components/admin/AdminUI";
import { ServiceRowActions } from "@/components/admin/ServiceRowActions";
import { ExternalIcon, PlusIcon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const items = await listServices();

  return (
    <div className="space-y-8">
      <PageTitle
        title="Services"
        description="Manage the pages under /services, the home page grid and the footer links. Drafts stay hidden until published."
        actions={
          <Link href="/admin/services/new">
            <AdminButton variant="primary"><PlusIcon size={16} /> New service</AdminButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-bg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] table-fixed text-left text-sm">
            <thead className="border-b border-line bg-surface">
              <tr>
                <th className="w-[8%] px-5 py-3 font-semibold">Order</th>
                <th className="w-[44%] px-5 py-3 font-semibold">Service</th>
                <th className="w-[14%] px-5 py-3 font-semibold">Category</th>
                <th className="w-[14%] px-5 py-3 font-semibold">Status</th>
                <th className="w-[20%] px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-5 py-4 font-mono text-xs text-muted">{item.order}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold leading-5">{item.keyword}</p>
                    <a
                      href={`/services/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 break-all font-mono text-xs text-muted hover:text-ink"
                    >
                      /services/{item.slug} <ExternalIcon size={12} />
                    </a>
                    <p className="mt-1 line-clamp-1 text-xs text-muted">{item.metaDescription}</p>
                  </td>
                  <td className="px-5 py-4 text-xs uppercase tracking-wider text-ink-soft">{item.category}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.published ? "bg-brand text-ink" : "bg-surface text-ink-soft"}`}>
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ServiceRowActions id={item.id} name={item.keyword} />
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted">
                    No services. Create one to get started.
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
