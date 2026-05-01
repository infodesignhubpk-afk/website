import type { ReactNode } from "react";
import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin | Design Hub",
  description: "Design Hub admin panel.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) {
    return <div className="min-h-[calc(100vh-4rem)] bg-surface">{children}</div>;
  }
  return <AdminShell>{children}</AdminShell>;
}
