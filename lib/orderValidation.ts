import { z } from "zod";
import { phoneSchema } from "@/lib/validation";

export const MAX_ORDER_ITEMS = 50;
export const MAX_UNIT_PRICE = 10_000_000;
/** Upper bound for an order's subtotal and total; anything above is refused. */
export const MAX_ORDER_TOTAL = 1e10;

/** The shape createOrder generates: "DH-" plus 10 uppercase hex characters. */
export const ORDER_REFERENCE_PATTERN = /^DH-[0-9A-F]{10}$/;

// Name, slug, price and currency are what the cart displayed; /api/orders
// ignores them and rebuilds each line from the products table by productId.
export const orderItemSchema = z.object({
  productId: z.string().min(1).max(100),
  productSlug: z.string().min(1).max(200),
  productName: z.string().min(1).max(200),
  quantity: z.number().int().positive().max(999),
  unitPrice: z.number().nonnegative().max(MAX_UNIT_PRICE),
  currency: z.string().min(2).max(8),
});

export const deliveryMethodSchema = z.enum(["pickup", "peshawar", "courier"]);
export const paymentMethodSchema = z.enum(["cod", "bank_transfer", "jazzcash", "easypaisa"]);

export const deliveryAddressSchema = z.object({
  street: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(80).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  landmark: z.string().max(200).optional().or(z.literal("")),
});

export const orderRequestSchema = z
  .object({
    customerName: z.string().min(2).max(120),
    customerPhone: phoneSchema,
    customerEmail: z.string().email().max(200).optional().or(z.literal("")),
    customerBusiness: z.string().max(120).optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
    items: z.array(orderItemSchema).min(1).max(MAX_ORDER_ITEMS),
    deliveryMethod: deliveryMethodSchema.optional(),
    deliveryAddress: deliveryAddressSchema.optional(),
    paymentMethod: paymentMethodSchema.optional(),
    // Honeypot. Any short value is accepted so a bot that fills it is not told
    // the rule; the route answers a filled one with a fake success.
    website: z.string().max(500).optional().default(""),
  })
  // Same rule the checkout enforces: cash on delivery is not offered for
  // courier. A missing paymentMethod defaults to "cod" in the route.
  .refine((v) => !(v.deliveryMethod === "courier" && (v.paymentMethod ?? "cod") === "cod"), {
    message: "Cash on delivery is only available for Pickup and Peshawar local delivery.",
    path: ["paymentMethod"],
  });

export type OrderRequest = z.infer<typeof orderRequestSchema>;

export const DELIVERY_FEES: Record<"pickup" | "peshawar" | "courier", number> = {
  pickup: 0,
  peshawar: 300,
  courier: 600,
};

export const DELIVERY_LABELS: Record<"pickup" | "peshawar" | "courier", string> = {
  pickup: "Pickup from our office",
  peshawar: "Peshawar local delivery",
  courier: "Country-wide courier",
};

export const PAYMENT_LABELS: Record<"cod" | "bank_transfer" | "jazzcash" | "easypaisa", string> = {
  cod: "Cash on delivery",
  bank_transfer: "Bank transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

export function deliveryFeeFor(method: "pickup" | "peshawar" | "courier" | undefined): number {
  if (!method) return 0;
  return DELIVERY_FEES[method] ?? 0;
}

export function orderTotals(
  items: { quantity: number; unitPrice: number }[],
  deliveryFee: number,
): { subtotal: number; total: number } {
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  return { subtotal, total: subtotal + deliveryFee };
}

/** False for a NaN/Infinity amount (stored as null) or one above MAX_ORDER_TOTAL. */
export function orderAmountOk(amount: number): boolean {
  return Number.isFinite(amount) && amount >= 0 && amount <= MAX_ORDER_TOTAL;
}
