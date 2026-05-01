"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { ArrowRightIcon, TrashIcon } from "@/components/ui/Icons";

export function CartView() {
  const { items, subtotal, currency, hydrated, setQuantity, remove, clear } = useCart();

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-line bg-bg p-10 text-center text-sm text-muted">
        Loading cart…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Your cart is empty</h2>
        <p className="mt-2 text-base text-ink-soft">Browse the shop and add a product to get started.</p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-base font-semibold text-bg hover:bg-ink-soft"
          >
            Browse the shop
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ul className="overflow-hidden rounded-2xl border border-line bg-bg">
          {items.map((item, idx) => (
            <li
              key={item.productId}
              className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 ${idx > 0 ? "border-t border-line" : ""}`}
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-surface">
                {item.image ? (
                  <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="96px" unoptimized />
                ) : (
                  <div className="grid h-full place-items-center p-2 text-center text-xs font-semibold">
                    {item.productName}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productSlug}`} className="text-base font-semibold tracking-tight hover:underline">
                  {item.productName}
                </Link>
                <p className="mt-1 text-xs font-mono text-muted">/products/{item.productSlug}</p>
                <p className="mt-1 text-sm text-ink-soft">{item.currency} {item.unitPrice.toLocaleString()} each</p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
                <div className="inline-flex items-center rounded-full border border-line bg-bg">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    aria-label="Decrease quantity"
                    className="grid h-9 w-9 place-items-center rounded-l-full text-base hover:bg-surface"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isFinite(v) && v >= 0) setQuantity(item.productId, Math.min(999, Math.floor(v)));
                    }}
                    aria-label={`Quantity for ${item.productName}`}
                    className="h-9 w-12 border-x border-line bg-bg text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    aria-label="Increase quantity"
                    className="grid h-9 w-9 place-items-center rounded-r-full text-base hover:bg-surface"
                  >
                    +
                  </button>
                </div>

                <p className="text-base font-bold">
                  {item.currency} {(item.unitPrice * item.quantity).toLocaleString()}
                </p>

                <button
                  type="button"
                  onClick={() => remove(item.productId)}
                  aria-label={`Remove ${item.productName} from cart`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
                >
                  <TrashIcon size={14} /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/products" className="text-sm font-semibold text-ink underline-offset-2 hover:underline">
            ← Continue shopping
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear the entire cart?")) clear();
            }}
            className="text-xs font-semibold text-muted hover:text-red-700"
          >
            Clear cart
          </button>
        </div>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-28 rounded-2xl border border-line bg-bg p-6">
          <h2 className="text-lg font-semibold tracking-tight">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="font-semibold">{currency} {subtotal.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>Delivery</dt>
              <dd>Calculated at checkout</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-base font-bold">
            <span>Total (excl. delivery)</span>
            <span>{currency} {subtotal.toLocaleString()}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cta px-6 py-3 text-base font-semibold text-ink hover:bg-cta-dark"
          >
            Proceed to checkout
            <ArrowRightIcon size={16} />
          </Link>
          <p className="mt-3 text-center text-xs text-muted">No payment is taken online. We confirm by phone or WhatsApp before fulfilment.</p>
        </div>
      </aside>
    </div>
  );
}
