"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CheckIcon } from "@/components/ui/Icons";

type Props = {
  productId: string;
  productSlug: string;
  productName: string;
  unitPrice: number;
  currency: string;
  image?: string;
  inStock: boolean;
};

export function AddToCartButton({ productId, productSlug, productName, unitPrice, currency, image, inStock }: Props) {
  const { add, items, hydrated } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.find((p) => p.productId === productId);

  function handleAdd() {
    if (!inStock) return;
    add({ productId, productSlug, productName, unitPrice, currency, image }, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="rounded-2xl border border-line bg-bg p-6">
      {!inStock ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          Currently out of stock — please check back soon or contact us for a custom quote.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-line bg-bg">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-10 w-10 place-items-center rounded-l-full text-lg hover:bg-surface"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={999}
                value={qty}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v) && v >= 1) setQty(Math.min(999, Math.floor(v)));
                }}
                aria-label="Quantity"
                className="h-10 w-14 border-x border-line bg-bg text-center text-base font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(999, q + 1))}
                aria-label="Increase quantity"
                className="grid h-10 w-10 place-items-center rounded-r-full text-lg hover:bg-surface"
              >
                +
              </button>
            </div>

            <div className="text-sm text-ink-soft">
              <p>Subtotal</p>
              <p className="text-lg font-bold text-ink">{currency} {(qty * unitPrice).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!hydrated}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-base font-semibold text-bg hover:bg-ink-soft disabled:opacity-50"
            >
              {justAdded ? (
                <>
                  <CheckIcon size={18} /> Added to cart
                </>
              ) : (
                <>Add to cart</>
              )}
            </button>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-full border border-line bg-bg px-6 py-3 text-base font-semibold hover:border-ink"
            >
              View cart{inCart ? ` (${inCart.quantity})` : ""}
            </Link>
            <Link
              href="/checkout"
              onClick={() => add({ productId, productSlug, productName, unitPrice, currency, image }, qty)}
              className="inline-flex items-center justify-center rounded-full bg-cta px-6 py-3 text-base font-semibold text-ink hover:bg-cta-dark"
            >
              Buy now
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
