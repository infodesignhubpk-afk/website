import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

type Crumb = { name: string; href: string };

type Props = {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  surface?: "white" | "alt" | "ink";
  align?: "left" | "center";
  eyebrow?: ReactNode;
  children?: ReactNode;
};

const surfaces = {
  white: "bg-bg text-ink",
  alt: "bg-surface text-ink",
  ink: "bg-ink text-white",
};

export function PageHero({
  title,
  description,
  breadcrumbs,
  surface = "white",
  align = "left",
  eyebrow,
  children,
}: Props) {
  const isInk = surface === "ink";
  return (
    <section className={cn("pt-8 pb-10 md:pt-12 md:pb-12", surfaces[surface])}>
      <Container>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-5" />
        )}
        <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
          {eyebrow && (
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              {eyebrow}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p
              className={cn(
                "mt-3 text-base md:text-lg leading-relaxed",
                isInk ? "text-white/80" : "text-ink-soft",
              )}
            >
              {description}
            </p>
          )}
          {children && <div className="mt-5">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
