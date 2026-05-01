"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const adminInput =
  "w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
        {required ? <span className="text-cta"> *</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs font-medium text-red-700">{error}</p> : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement>;
export function TextInput(props: InputProps) {
  return <input {...props} className={cn(adminInput, props.className)} />;
}

type AreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
export function TextArea(props: AreaProps) {
  return <textarea {...props} className={cn(adminInput, "min-h-24", props.className)} />;
}

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ink" | "ghost" | "danger";
};
export function AdminButton({ variant = "primary", className, ...rest }: AdminButtonProps) {
  const variants = {
    primary: "bg-cta text-ink hover:bg-cta-dark border border-cta",
    ink: "bg-ink text-bg hover:bg-ink-soft border border-ink",
    ghost: "bg-bg text-ink border border-line hover:border-ink",
    danger: "bg-red-50 text-red-800 border border-red-200 hover:bg-red-100",
  };
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className,
      )}
    />
  );
}

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-ink-soft">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatusToast({ ok, error }: { ok?: boolean; error?: string }) {
  if (ok) return <p className="rounded-xl border border-brand bg-brand/20 px-4 py-2 text-sm font-medium">Saved.</p>;
  if (error) return <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800">{error}</p>;
  return null;
}
