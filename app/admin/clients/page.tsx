import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listClients } from "@/lib/admin/clients";
import { AdminButton, PageTitle } from "@/components/admin/AdminUI";
import { ClientRowActions } from "@/components/admin/ClientRowActions";
import { PlusIcon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const clients = await listClients();
  return (
    <div className="space-y-8">
      <PageTitle
        title="Clients"
        description="Logos shown in the homepage trust bar. Drag-equivalent: edit Display Order to re-arrange."
        actions={
          <Link href="/admin/clients/new">
            <AdminButton variant="primary"><PlusIcon size={16} /> New client</AdminButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-bg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface">
            <tr>
              <th className="px-5 py-3 font-semibold">Logo</th>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {clients.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-4">
                  {c.logoUrl ? (
                    <div className="relative h-10 w-24 overflow-hidden rounded border border-line bg-surface">
                      <Image src={c.logoUrl} alt={c.name} fill sizes="96px" className="object-contain p-1" unoptimized />
                    </div>
                  ) : (
                    <span className="text-xs text-muted">No logo</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold">{c.name}</p>
                  {c.linkUrl ? (
                    <a href={c.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-soft underline">
                      {c.linkUrl}
                    </a>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-sm">{c.order}</td>
                <td className="px-5 py-4 text-right">
                  <ClientRowActions id={c.id} />
                </td>
              </tr>
            ))}
            {clients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-muted">
                  No clients yet. Add one and it will appear in the trust bar on the homepage.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
