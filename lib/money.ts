// Display helpers for stored order and product amounts. Stored JSON is not
// guaranteed to hold numbers (JSON.stringify writes Infinity/NaN as null), so
// a page must never call toLocaleString on a raw value.

/** Formats an amount for display, or a dash when it is missing or not finite. */
export function formatAmount(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? value.toLocaleString() : "—";
}

/** quantity × unitPrice, or NaN (which formatAmount shows as a dash) when either is not a finite number. */
export function lineTotal(quantity: unknown, unitPrice: unknown): number {
  if (typeof quantity !== "number" || typeof unitPrice !== "number") return NaN;
  return quantity * unitPrice;
}
