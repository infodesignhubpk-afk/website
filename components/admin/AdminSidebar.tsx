"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const sections: { heading: string; items: { href: string; label: string }[] }[] = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/blogs", label: "Blogs" },
      { href: "/admin/products", label: "Products" },
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/media", label: "Media" },
    ],
  },
  {
    heading: "Settings",
    items: [
      { href: "/admin/site", label: "Site Settings" },
      { href: "/admin/seo", label: "SEO Settings" },
    ],
  },
];

export function AdminSidebar({ siteName, logoUrl }: { siteName: string; logoUrl?: string }) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line bg-bg md:block">
      <div className="flex h-24 items-center border-b border-line px-5">
        <Logo name={siteName} logoUrl={logoUrl} variant="ink" />
      </div>
      <nav aria-label="Admin" className="flex h-[calc(100vh-6rem)] flex-col gap-6 overflow-y-auto p-5 text-sm">
        {sections.map((section) => (
          <div key={section.heading}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{section.heading}</p>
            <ul className="mt-3 space-y-1">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2 font-medium",
                        active
                          ? "bg-ink text-bg"
                          : "text-ink-soft hover:bg-surface hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
