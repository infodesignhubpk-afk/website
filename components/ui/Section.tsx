import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  surface?: "white" | "alt" | "ink" | "brand";
  id?: string;
  ariaLabel?: string;
};

const surfaces = {
  white: "bg-bg text-ink",
  alt: "bg-surface text-ink",
  ink: "bg-ink text-white",
  brand: "bg-brand text-ink",
};

export function Section({ children, className, surface = "white", id, ariaLabel }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn("py-16 md:py-24 lg:py-32", surfaces[surface], className)}
    >
      {children}
    </section>
  );
}
