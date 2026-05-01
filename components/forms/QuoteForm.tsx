"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteInput } from "@/lib/validation";
import { FormField, inputCls } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/Icons";

const budgetOptions = [
  "Under PKR 25,000",
  "PKR 25,000 – 100,000",
  "PKR 100,000 – 500,000",
  "PKR 500,000+",
  "Not sure yet",
];

const timelineOptions = ["ASAP", "Within 2 weeks", "Within 1 month", "1–3 months", "Flexible"];

type Step = 1 | 2 | 3;

export function QuoteForm() {
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
    setValue,
    reset,
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      service: "",
      details: "",
      name: "",
      phone: "",
      email: "",
      business: "",
      budget: "",
      timeline: "",
      website: "",
    },
    mode: "onTouched",
  });

  const service = watch("service");
  const budget = watch("budget");
  const timeline = watch("timeline");

  async function onSubmit(values: QuoteInput) {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, kind: "quote" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      setMessage("Quote request received. A project manager will reply within one working day with a fixed-scope proposal.");
      reset();
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Something went wrong. Please WhatsApp us.");
    }
  }

  async function next() {
    let valid = false;
    if (step === 1) valid = await trigger(["service"]);
    else if (step === 2) valid = await trigger(["details"]);
    if (valid) setStep((s) => (Math.min(3, s + 1) as Step));
  }

  function back() {
    setStep((s) => (Math.max(1, s - 1) as Step));
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-brand bg-brand/20 p-8 md:p-12 text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Thank you</h2>
        <p className="mt-3 text-base text-ink-soft md:text-lg">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-2xl border border-line bg-bg p-6 md:p-10">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />
      <ol className="mb-8 grid grid-cols-3 gap-3 text-xs font-semibold uppercase tracking-wider">
        {[1, 2, 3].map((n) => (
          <li
            key={n}
            className={cn(
              "rounded-full border px-3 py-2 text-center",
              n === step ? "border-ink bg-ink text-bg" : n < step ? "border-brand bg-brand text-ink" : "border-line text-muted",
            )}
          >
            Step {n}
          </li>
        ))}
      </ol>

      {step === 1 ? (
        <fieldset>
          <legend className="text-2xl font-semibold tracking-tight md:text-3xl">What do you need?</legend>
          <p className="mt-2 text-sm text-ink-soft">Pick the closest match — you can refine in the next step.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {services.map((s) => (
              <label
                key={s.slug}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium",
                  service === s.keyword ? "border-ink bg-ink text-bg" : "border-line",
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={s.keyword}
                  checked={service === s.keyword}
                  onChange={() => setValue("service", s.keyword, { shouldValidate: true })}
                />
                <span>{s.keyword}</span>
                {service === s.keyword ? <CheckIcon size={14} aria-hidden /> : null}
              </label>
            ))}
          </div>
          {errors.service ? (
            <p className="mt-3 text-xs font-medium text-red-700">{errors.service.message}</p>
          ) : null}
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset className="space-y-5">
          <legend className="text-2xl font-semibold tracking-tight md:text-3xl">Project details</legend>

          <FormField label="Tell us about the project" htmlFor="q-details" required hint="Quantity, sizes, timelines, references — anything that helps us quote accurately." error={errors.details?.message}>
            <textarea id="q-details" rows={6} className={inputCls} {...register("details")} />
          </FormField>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-ink">Estimated budget</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {budgetOptions.map((b) => (
                  <li key={b}>
                    <button
                      type="button"
                      onClick={() => setValue("budget", b, { shouldValidate: true })}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium",
                        budget === b ? "border-ink bg-ink text-bg" : "border-line",
                      )}
                    >
                      {b}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Timeline</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {timelineOptions.map((t) => (
                  <li key={t}>
                    <button
                      type="button"
                      onClick={() => setValue("timeline", t, { shouldValidate: true })}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium",
                        timeline === t ? "border-ink bg-ink text-bg" : "border-line",
                      )}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <fieldset className="space-y-5">
          <legend className="text-2xl font-semibold tracking-tight md:text-3xl">Your details</legend>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Full name" htmlFor="q-name" required error={errors.name?.message}>
              <input id="q-name" type="text" autoComplete="name" className={inputCls} {...register("name")} />
            </FormField>
            <FormField label="Phone / WhatsApp" htmlFor="q-phone" required error={errors.phone?.message}>
              <input id="q-phone" type="tel" autoComplete="tel" className={inputCls} {...register("phone")} />
            </FormField>
            <FormField label="Email" htmlFor="q-email" error={errors.email?.message}>
              <input id="q-email" type="email" autoComplete="email" className={inputCls} {...register("email")} />
            </FormField>
            <FormField label="Business name" htmlFor="q-business" error={errors.business?.message}>
              <input id="q-business" type="text" autoComplete="organization" className={inputCls} {...register("business")} />
            </FormField>
          </div>
        </fieldset>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={back}>
            Back
          </Button>
        ) : <span />}
        {step < 3 ? (
          <Button type="button" onClick={next}>
            Next step
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Submit quote request"}
          </Button>
        )}
      </div>
      {status === "error" ? <p className="mt-4 text-sm text-red-700">{message}</p> : null}
    </form>
  );
}
