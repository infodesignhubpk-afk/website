"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink } from "@/lib/utils";

type NavLink = { href: string; label: string };

type Props = {
  links: ReadonlyArray<NavLink>;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  siteName: string;
};

export function MobileMenu({ links, phone, phoneDisplay, whatsappNumber, siteName }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink hover:border-ink md:hidden"
      >
        <MenuIcon size={18} />
      </button>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[999] bg-ink/40 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        id="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed inset-y-0 right-0 z-[999] flex w-[85%] max-w-sm flex-col bg-bg shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink hover:border-ink"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col">
            {links.map((l) => {
              const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block rounded-xl px-4 py-3 text-base font-semibold tracking-tight transition-colors ${
                      isActive ? "bg-surface text-ink" : "text-ink-soft hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-line p-4">
          <Link
            href="/get-quote"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-cta bg-cta px-5 py-3 text-sm font-semibold text-ink hover:bg-cta-dark hover:border-cta-dark"
          >
            Get a Quote
          </Link>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={`tel:${phone}`}
              aria-label={`Call ${phoneDisplay}`}
              className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink"
            >
              <PhoneIcon size={16} />
              Call
            </a>
            <a
              href={whatsappLink(whatsappNumber, `Hi ${siteName}, I'd like to discuss a project.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink"
            >
              <WhatsAppIcon size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
