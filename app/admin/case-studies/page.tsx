import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listCaseStudies } from "@/lib/admin/case-studies";
import { AdminButton, PageTitle } from "@/components/admin/AdminUI";
import { CaseStudyRowActions } from "@/components/admin/CaseStudyRowActions";
import { ExternalIcon, PlusIcon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudiesPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const items = await listCaseStudies();

  return (
    <div className="space-y-8">
      <PageTitle
        title="Case studies"
        description="Manage stories shown on /case-studies. Drafts stay hidden until published."
        actions={
          <Link href="/admin/case-studies/new">
            <AdminButton variant="primary"><PlusIcon size={16} /> New case study</AdminButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-bg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] table-fixed text-left text-sm">
            <thead className="border-b border-line bg-surface">
              <tr>
                <th className="w-[38%] px-5 py-3 font-semibold">Title</th>
                <th className="w-[18%] px-5 py-3 font-semibold">Client</th>
                <th className="w-[14%] px-5 py-3 font-semibold">Category</th>
                <th className="w-[12%] px-5 py-3 font-semibold">Status</th>
                <th className="w-[18%] px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold leading-5">{item.title}</p>
                    <a
                      href={`/case-studies/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 break-all font-mono text-xs text-muted hover:text-ink"
                    >
                      /{item.slug} <ExternalIcon size={12} />
                    </a>
                    <p className="mt-1 line-clamp-1 text-xs text-muted">{item.summary}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">{item.client}</td>
                  <td className="px-5 py-4 text-xs uppercase tracking-wider text-ink-soft">{item.category}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.published ? "bg-brand text-ink" : "bg-surface text-ink-soft"}`}>
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <CaseStudyRowActions id={item.id} />
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted">
                    No case studies. Create one to get started.
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
