import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  level?: 2 | 3;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  level = 2,
  className,
}: Props) {
  const Tag = level === 2 ? "h2" : "h3";
  const sizing =
    level === 2
      ? "text-3xl md:text-5xl font-bold tracking-tight"
      : "text-xl md:text-2xl font-semibold tracking-tight";
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ink" />
          {eyebrow}
        </p>
      ) : null}
      <Tag className={sizing}>{title}</Tag>
      {description ? (
        <p className="mt-4 text-base md:text-lg leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
    </div>
  );
}
