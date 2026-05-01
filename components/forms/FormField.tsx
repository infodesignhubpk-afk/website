"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function FormField({ label, htmlFor, error, hint, required, children, className }: Props) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {required ? <span aria-hidden className="text-cta"> *</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
      {error ? <p className="mt-1.5 text-xs font-medium text-red-700">{error}</p> : null}
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none";
