"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceInquirySchema, type ServiceInquiryInput } from "@/lib/validation";
import { FormField, inputCls } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";

type Props = {
  defaultService: string;
};

export function ServiceInquiryForm({ defaultService }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ServiceInquiryInput>({
    resolver: zodResolver(serviceInquirySchema),
    defaultValues: { service: defaultService, name: "", phone: "", brief: "", website: "" },
    mode: "onTouched",
  });

  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(values: ServiceInquiryInput) {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, kind: "service" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      setMessage("Thanks — a project manager will reply within one working day.");
      reset({ service: defaultService, name: "", phone: "", brief: "", website: "" });
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Something went wrong. Please WhatsApp us.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-brand bg-brand/20 p-6 md:p-8">
        <h3 className="text-xl font-semibold tracking-tight">Brief received</h3>
        <p className="mt-2 text-base text-ink-soft">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input type="hidden" {...register("service")} />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Your name" htmlFor="si-name" required error={errors.name?.message}>
          <input id="si-name" type="text" autoComplete="name" className={inputCls} {...register("name")} />
        </FormField>
        <FormField label="Phone / WhatsApp" htmlFor="si-phone" required error={errors.phone?.message}>
          <input id="si-phone" type="tel" autoComplete="tel" className={inputCls} {...register("phone")} />
        </FormField>
      </div>
      <FormField
        label="Brief"
        htmlFor="si-brief"
        required
        hint={`Tell us a little about your ${defaultService.toLowerCase()} project — quantity, deadline, and any reference work.`}
        error={errors.brief?.message}
      >
        <textarea id="si-brief" rows={5} className={inputCls} {...register("brief")} />
      </FormField>
      <Button size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : `Request a ${defaultService} quote`}
      </Button>
      {status === "error" ? <p className="text-sm text-red-700">{message}</p> : null}
    </form>
  );
}
