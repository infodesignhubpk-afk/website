"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { FormField, inputCls } from "@/components/forms/FormField";
import { phoneSchema } from "@/lib/validation";
import { z } from "zod";

const formSchema = z.object({
  quantity: z.number().int().positive().max(999),
  customerName: z.string().min(2).max(120),
  customerPhone: phoneSchema,
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerBusiness: z.string().max(120).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});

type FormInput = z.infer<typeof formSchema>;

type Props = {
  productId: string;
  productSlug: string;
  productName: string;
  unitPrice: number;
  currency: string;
  inStock: boolean;
};

export function ProductOrderForm({ productId, productSlug, productName, unitPrice, currency, inStock }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: { quantity: 1, customerName: "", customerPhone: "", customerEmail: "", customerBusiness: "", notes: "", website: "" },
    mode: "onTouched",
  });

  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const qty = Number(watch("quantity") || 1);
  const total = qty * unitPrice;

  async function onSubmit(values: FormInput) {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          customerEmail: values.customerEmail,
          customerBusiness: values.customerBusiness,
          notes: values.notes,
          items: [
            {
              productId,
              productSlug,
              productName,
              quantity: Number(values.quantity),
              unitPrice,
              currency,
            },
          ],
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Order failed (${res.status})`);
      }
      const data = (await res.json()) as { reference?: string };
      setStatus("ok");
      setReference(data.reference ?? null);
      reset();
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Order failed.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-brand bg-brand/20 p-6">
        <h3 className="text-xl font-semibold tracking-tight">Order received</h3>
        <p className="mt-2 text-base text-ink-soft">
          Reference {reference ? <span className="font-mono font-bold text-ink">{reference}</span> : null}. A project manager will call to confirm payment and timeline within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-2xl border border-line bg-bg p-6">
      <h3 className="text-lg font-semibold tracking-tight">Reserve this product</h3>
      <p className="mt-1 text-sm text-ink-soft">Submit the form, then we&apos;ll confirm payment options by phone or WhatsApp.</p>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      <div className="mt-5 space-y-4">
        <FormField label="Quantity" htmlFor="po-qty" required error={errors.quantity?.message}>
          <input
            id="po-qty"
            type="number"
            min={1}
            max={999}
            className={inputCls}
            {...register("quantity", { valueAsNumber: true })}
          />
        </FormField>

        <div className="rounded-xl border border-line bg-surface p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Unit price</span>
            <span className="font-semibold">{currency} {unitPrice.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-base font-bold">
            <span>Total</span>
            <span>{currency} {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Your name" htmlFor="po-name" required error={errors.customerName?.message}>
            <input id="po-name" type="text" autoComplete="name" className={inputCls} {...register("customerName")} />
          </FormField>
          <FormField label="Phone / WhatsApp" htmlFor="po-phone" required error={errors.customerPhone?.message}>
            <input id="po-phone" type="tel" autoComplete="tel" className={inputCls} {...register("customerPhone")} />
          </FormField>
          <FormField label="Email" htmlFor="po-email" error={errors.customerEmail?.message}>
            <input id="po-email" type="email" autoComplete="email" className={inputCls} {...register("customerEmail")} />
          </FormField>
          <FormField label="Business name" htmlFor="po-business" error={errors.customerBusiness?.message}>
            <input id="po-business" type="text" autoComplete="organization" className={inputCls} {...register("customerBusiness")} />
          </FormField>
        </div>

        <FormField label="Notes (optional)" htmlFor="po-notes" hint="Delivery preferences, customisation requests, etc." error={errors.notes?.message}>
          <textarea id="po-notes" rows={3} className={inputCls} {...register("notes")} />
        </FormField>
      </div>

      <div className="mt-6">
        <Button size="lg" type="submit" disabled={isSubmitting || !inStock}>
          {!inStock ? "Out of stock" : isSubmitting ? "Sending..." : "Reserve now"}
        </Button>
      </div>
      {status === "error" ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}
    </form>
  );
}
