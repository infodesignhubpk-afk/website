import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listPortfolio } from "@/lib/admin/portfolio";
import { AdminButton, PageTitle } from "@/components/admin/AdminUI";
import { PortfolioRowActions } from "@/components/admin/PortfolioRowActions";
import { PlusIcon, ExternalIcon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const items = await listPortfolio();
  return (
    <div className="space-y-8">
      <PageTitle
        title="Portfolio"
        description="Client projects shown on /portfolio. Drafts stay hidden until published."
        actions={
          <Link href="/admin/portfolio/new">
            <AdminButton variant="primary"><PlusIcon size={16} /> New project</AdminButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-bg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface">
            <tr>
              <th className="px-5 py-3 font-semibold">Project</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Year</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded border border-line bg-surface">
                        <Image src={p.image} alt={p.title} fill sizes="64px" className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="grid h-12 w-16 shrink-0 place-items-center rounded border border-line bg-surface text-[10px] text-muted">
                        No image
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold">{p.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                        {p.client}
                        <Link href={`/portfolio/${p.slug}`} target="_blank" className="inline-flex items-center hover:text-ink">
                          <ExternalIcon size={12} />
                        </Link>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs uppercase tracking-wider text-ink-soft">{p.category}</td>
                <td className="px-5 py-4 text-sm">{p.year}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-brand/30 text-ink" : "bg-surface text-muted"}`}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <PortfolioRowActions id={p.id} />
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-muted">
                  No projects yet. Add one and it will appear on /portfolio.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
