import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ExternalIcon } from "@/components/ui/Icons";

export function AdminTopbar({ siteName }: { siteName: string }) {
  return (
    <div className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-line bg-bg/95 px-4 backdrop-blur md:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">{siteName}</p>
        <p className="text-base font-semibold tracking-tight">Admin Panel</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink hover:text-ink md:inline-flex"
        >
          <ExternalIcon size={14} /> View site
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}
