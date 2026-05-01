import { z } from "zod";
import { phoneSchema } from "@/lib/validation";

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().int().positive().max(999),
  unitPrice: z.number().nonnegative(),
  currency: z.string().min(2).max(8),
});

export const deliveryMethodSchema = z.enum(["pickup", "peshawar", "courier"]);
export const paymentMethodSchema = z.enum(["cod", "bank_transfer", "jazzcash", "easypaisa"]);

export const deliveryAddressSchema = z.object({
  street: z.string().min(3).max(200),
  city: z.string().min(2).max(80),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  landmark: z.string().max(200).optional().or(z.literal("")),
});

export const orderRequestSchema = z
  .object({
    customerName: z.string().min(2).max(120),
    customerPhone: phoneSchema,
    customerEmail: z.string().email().optional().or(z.literal("")),
    customerBusiness: z.string().max(120).optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
    items: z.array(orderItemSchema).min(1).max(50),
    deliveryMethod: deliveryMethodSchema.optional(),
    deliveryAddress: deliveryAddressSchema.optional(),
    paymentMethod: paymentMethodSchema.optional(),
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .refine(
    (v) => {
      if (v.deliveryMethod === "peshawar" || v.deliveryMethod === "courier") {
        return v.deliveryAddress && v.deliveryAddress.street && v.deliveryAddress.city;
      }
      return true;
    },
    { message: "Delivery address is required when delivery is selected", path: ["deliveryAddress"] },
  );

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
