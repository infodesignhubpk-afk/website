import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { getSite } from "@/lib/admin/site";

export async function AdminShell({ children }: { children: ReactNode }) {
  const site = await getSite();
  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="flex">
        <AdminSidebar siteName={site.name} logoUrl={site.logoUrl} />
        <div className="flex w-full min-w-0 flex-1 flex-col">
          <AdminTopbar siteName={site.name} />
          <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
