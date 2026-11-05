"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { FormField, inputCls } from "@/components/forms/FormField";
import { submitLead } from "@/components/forms/submitLead";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), mode: "onTouched" });

  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(values: ContactInput) {
    const result = await submitLead({ ...values, kind: "contact" });
    if (!result.ok) {
      setStatus("error");
      setMessage(result.message);
      return;
    }
    setStatus("ok");
    setMessage("Thanks — we will reply within one working day.");
    reset();
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-brand bg-brand/20 p-6 md:p-8">
        <h3 className="text-xl font-semibold tracking-tight">Message received</h3>
        <p className="mt-2 text-base text-ink-soft">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input type="hidden" defaultValue="" {...register("website")} />
      <FormField label="Your name" htmlFor="contact-name" required error={errors.name?.message}>
        <input id="contact-name" type="text" autoComplete="name" className={inputCls} {...register("name")} />
      </FormField>
      <FormField label="Phone" htmlFor="contact-phone" required error={errors.phone?.message}>
        <input id="contact-phone" type="tel" autoComplete="tel" className={inputCls} {...register("phone")} />
      </FormField>
      <FormField label="Email" htmlFor="contact-email" hint="Optional, but useful if we miss your call" error={errors.email?.message}>
        <input id="contact-email" type="email" autoComplete="email" className={inputCls} {...register("email")} />
      </FormField>
      <FormField label="What can we help with?" htmlFor="contact-message" required error={errors.message?.message}>
        <textarea id="contact-message" rows={5} className={inputCls} {...register("message")} />
      </FormField>
      <Button size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>
      {status === "error" ? <p className="text-sm text-red-700">{message}</p> : null}
    </form>
  );
}
