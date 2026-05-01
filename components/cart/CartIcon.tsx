"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartIcon({ variant = "ink" }: { variant?: "ink" | "white" }) {
  const { itemCount, hydrated } = useCart();
  const count = hydrated ? itemCount : 0;
  const tone = variant === "white" ? "text-white border-white/20 hover:border-brand hover:text-brand" : "text-ink border-line hover:border-ink";
  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart with ${count} item${count === 1 ? "" : "s"}` : "Cart"}
      className={`relative grid h-10 w-10 place-items-center rounded-full border ${tone}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 4h2.5l1.7 12.3a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.6L21.5 8H6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20.5" r="1.4" fill="currentColor" />
        <circle cx="17" cy="20.5" r="1.4" fill="currentColor" />
      </svg>
      {count > 0 ? (
        <span className="pointer-events-none absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-cta px-1 text-[11px] font-bold text-ink">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
