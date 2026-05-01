"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/lib/cart-context";
import { phoneSchema } from "@/lib/validation";
import { FormField, inputCls } from "@/components/forms/FormField";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type DeliveryMethod = "pickup" | "peshawar" | "courier";
type PaymentMethod = "cod" | "bank_transfer" | "jazzcash" | "easypaisa";

const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  pickup: 0,
  peshawar: 300,
  courier: 600,
};

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; description: string; fee: number }[] = [
  { value: "pickup", label: "Pickup from our office", description: "Collect from University Road, Peshawar (Mon–Sat 9:30am–8pm).", fee: 0 },
  { value: "peshawar", label: "Peshawar local delivery", description: "Within Peshawar city limits — typically 24 to 48 hours.", fee: 300 },
  { value: "courier", label: "Country-wide courier", description: "Tracked courier delivery anywhere in Pakistan — 2 to 5 working days.", fee: 600 },
];

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: "cod", label: "Cash on delivery", description: "Pay when the order is handed over (Pickup and Peshawar delivery only)." },
  { value: "bank_transfer", label: "Bank transfer", description: "We share account details after order is placed; production starts on confirmation." },
  { value: "jazzcash", label: "JazzCash", description: "We share JazzCash details after order is placed." },
  { value: "easypaisa", label: "Easypaisa", description: "We share Easypaisa details after order is placed." },
];

const checkoutSchema = z
  .object({
    customerName: z.string().min(2, "Please enter your name").max(120),
    customerPhone: phoneSchema,
    customerEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
    customerBusiness: z.string().max(120).optional().or(z.literal("")),
    deliveryMethod: z.enum(["pickup", "peshawar", "courier"]),
    paymentMethod: z.enum(["cod", "bank_transfer", "jazzcash", "easypaisa"]),
    street: z.string().max(200).optional().or(z.literal("")),
    city: z.string().max(80).optional().or(z.literal("")),
    postalCode: z.string().max(20).optional().or(z.literal("")),
    landmark: z.string().max(200).optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    if (v.deliveryMethod !== "pickup") {
      if (!v.street || v.street.length < 3) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["street"], message: "Street address is required for delivery." });
      }
      if (!v.city || v.city.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["city"], message: "City is required for delivery." });
      }
    }
    if (v.paymentMethod === "cod" && v.deliveryMethod === "courier") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentMethod"],
        message: "Cash on delivery is only available for Pickup and Peshawar local delivery.",
      });
    }
  });

type FormInput = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const { items, subtotal, currency, hydrated, clear } = useCart();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerBusiness: "",
      deliveryMethod: "pickup",
      paymentMethod: "cod",
      street: "",
      city: "Peshawar",
      postalCode: "",
      landmark: "",
      notes: "",
      website: "",
    },
    mode: "onTouched",
  });

  const deliveryMethod = watch("deliveryMethod");
  const paymentMethod = watch("paymentMethod");
  const deliveryFee = DELIVERY_FEES[deliveryMethod] ?? 0;
  const total = subtotal + deliveryFee;

  // Force payment method to bank_transfer if courier + cod
  useEffect(() => {
    if (deliveryMethod === "courier" && paymentMethod === "cod") {
      setValue("paymentMethod", "bank_transfer", { shouldValidate: true });
    }
  }, [deliveryMethod, paymentMethod, setValue]);

  if (!hydrated) {
    return <div className="rounded-2xl border border-line bg-bg p-10 text-center text-sm text-muted">Loading checkout…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Your cart is empty</h2>
        <p className="mt-2 text-base text-ink-soft">Add a product to your cart before checking out.</p>
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

  async function onSubmit(values: FormInput) {
    setSubmitError(null);
    const payload = {
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      customerEmail: values.customerEmail || undefined,
      customerBusiness: values.customerBusiness || undefined,
      notes: values.notes || undefined,
      deliveryMethod: values.deliveryMethod,
      deliveryAddress:
        values.deliveryMethod !== "pickup"
          ? {
              street: values.street ?? "",
              city: values.city ?? "",
              postalCode: values.postalCode || undefined,
              landmark: values.landmark || undefined,
            }
          : undefined,
      paymentMethod: values.paymentMethod,
      items: items.map((it) => ({
        productId: it.productId,
        productSlug: it.productSlug,
        productName: it.productName,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        currency: it.currency,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = `Order failed (${res.status})`;
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {}
        throw new Error(msg);
      }
      const data = (await res.json()) as { reference?: string };
      const ref = data.reference ?? "";
      clear();
      router.push(`/checkout/success?ref=${encodeURIComponent(ref)}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Order failed.");
    }
  }

  const showAddress = deliveryMethod !== "pickup";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-3">
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      <div className="space-y-6 lg:col-span-2">
        <section className="rounded-2xl border border-line bg-bg p-6 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">1. Contact details</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormField label="Full name" htmlFor="co-name" required error={errors.customerName?.message}>
              <input id="co-name" type="text" autoComplete="name" className={inputCls} {...register("customerName")} />
            </FormField>
            <FormField label="Phone / WhatsApp" htmlFor="co-phone" required error={errors.customerPhone?.message}>
              <input id="co-phone" type="tel" autoComplete="tel" className={inputCls} {...register("customerPhone")} />
            </FormField>
            <FormField label="Email" htmlFor="co-email" error={errors.customerEmail?.message}>
              <input id="co-email" type="email" autoComplete="email" className={inputCls} {...register("customerEmail")} />
            </FormField>
            <FormField label="Business (optional)" htmlFor="co-biz" error={errors.customerBusiness?.message}>
              <input id="co-biz" type="text" autoComplete="organization" className={inputCls} {...register("customerBusiness")} />
            </FormField>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-bg p-6 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">2. Delivery</h2>
          <ul className="mt-5 space-y-3">
            {DELIVERY_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                    deliveryMethod === opt.value ? "border-ink bg-surface" : "border-line hover:border-ink",
                  )}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register("deliveryMethod")}
                    className="mt-1 h-4 w-4 accent-current"
                  />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-base font-semibold">{opt.label}</span>
                      <span className="text-sm font-bold">{currency} {opt.fee.toLocaleString()}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{opt.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {showAddress ? (
            <div className="mt-6 grid gap-5 border-t border-line pt-6 md:grid-cols-2">
              <FormField label="Street address" htmlFor="co-street" required error={errors.street?.message} className="md:col-span-2">
                <input id="co-street" type="text" autoComplete="street-address" className={inputCls} {...register("street")} />
              </FormField>
              <FormField label="City" htmlFor="co-city" required error={errors.city?.message}>
                <input id="co-city" type="text" autoComplete="address-level2" className={inputCls} {...register("city")} />
              </FormField>
              <FormField label="Postal code (optional)" htmlFor="co-postal" error={errors.postalCode?.message}>
                <input id="co-postal" type="text" autoComplete="postal-code" className={inputCls} {...register("postalCode")} />
              </FormField>
              <FormField label="Landmark / instructions (optional)" htmlFor="co-landmark" error={errors.landmark?.message} className="md:col-span-2">
                <input id="co-landmark" type="text" className={inputCls} {...register("landmark")} />
              </FormField>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-line bg-bg p-6 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">3. Payment</h2>
          <ul className="mt-5 space-y-3">
            {PAYMENT_OPTIONS.map((opt) => {
              const disabled = opt.value === "cod" && deliveryMethod === "courier";
              return (
                <li key={opt.value}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                      paymentMethod === opt.value ? "border-ink bg-surface" : "border-line hover:border-ink",
                      disabled && "cursor-not-allowed opacity-50 hover:border-line",
                    )}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      disabled={disabled}
                      {...register("paymentMethod")}
                      className="mt-1 h-4 w-4 accent-current"
                    />
                    <span className="flex-1">
                      <span className="block text-base font-semibold">{opt.label}</span>
                      <span className="mt-0.5 block text-sm text-ink-soft">{opt.description}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          {errors.paymentMethod ? (
            <p className="mt-3 text-xs font-medium text-red-700">{errors.paymentMethod.message}</p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-line bg-bg p-6 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">Order notes</h2>
          <p className="mt-1 text-sm text-ink-soft">Anything we should know — branding files, customisation, deadline.</p>
          <div className="mt-5">
            <FormField label="Notes (optional)" htmlFor="co-notes" error={errors.notes?.message}>
              <textarea id="co-notes" rows={4} className={inputCls} {...register("notes")} />
            </FormField>
          </div>
        </section>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-28 rounded-2xl border border-line bg-bg p-6">
          <h2 className="text-lg font-semibold tracking-tight">Your order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((it) => (
              <li key={it.productId} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                  {it.image ? (
                    <Image src={it.image} alt={it.productName} fill className="object-cover" sizes="48px" unoptimized />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{it.productName}</p>
                  <p className="text-xs text-muted">× {it.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{it.currency} {(it.quantity * it.unitPrice).toLocaleString()}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="font-semibold">{currency} {subtotal.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Delivery</dt>
              <dd className="font-semibold">{currency} {deliveryFee.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd>{currency} {total.toLocaleString()}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cta px-6 py-3 text-base font-semibold text-ink hover:bg-cta-dark disabled:opacity-50"
          >
            {isSubmitting ? "Placing order…" : "Place order"}
            {!isSubmitting ? <ArrowRightIcon size={16} /> : null}
          </button>

          {submitError ? (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">{submitError}</p>
          ) : null}

          <p className="mt-3 text-center text-xs text-muted">
            No payment is taken online. We confirm by phone or WhatsApp before fulfilment.
          </p>
        </div>
      </aside>
    </form>
  );
}
