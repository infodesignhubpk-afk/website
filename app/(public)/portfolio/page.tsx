import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { portfolio } from "@/data/portfolio";
import { buildMetadata } from "@/lib/seo";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import type { ServiceCategory } from "@/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Portfolio | Design Hub Peshawar",
  description:
    "Selected branding, signage, printing, vehicle and digital projects shipped by Design Hub for businesses across Peshawar and KP.",
  path: "/portfolio",
});

type Filter = "all" | ServiceCategory;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "logo", label: "Logos" },
  { value: "branding", label: "Branding" },
  { value: "signage", label: "Signage" },
  { value: "printing", label: "Print" },
  { value: "vehicle", label: "Vehicle" },
  { value: "social", label: "Social" },
];

const palettes: Record<ServiceCategory, string> = {
  logo: "bg-ink text-white",
  branding: "bg-brand text-ink",
  signage: "bg-cta text-ink",
  printing: "bg-surface text-ink border border-line",
  vehicle: "bg-ink text-white",
  social: "bg-brand text-ink",
};

function isFilter(value: unknown): value is Filter {
  return typeof value === "string" && filters.some((f) => f.value === value);
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const active: Filter = isFilter(sp.category) ? sp.category : "all";
  const items = active === "all" ? portfolio : portfolio.filter((p) => p.category === active);

  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Portfolio", href: "/portfolio" }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Portfolio</h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
              A selection of identity, signage, print, vehicle and digital work shipped over the last 24 months. Use the filters to drill into a specific service line.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white" className="pt-0">
        <Container>
          <ul className="flex flex-wrap gap-2 border-b border-line pb-6">
            {filters.map((f) => {
              const href = f.value === "all" ? "/portfolio" : `/portfolio?category=${f.value}`;
              const isActive = active === f.value;
              return (
                <li key={f.value}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold tracking-tight transition-colors",
                      isActive
                        ? "border-ink bg-ink text-bg"
                        : "border-line text-ink-soft hover:border-ink hover:text-ink",
                    )}
                  >
                    {f.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-line"
                >
                  <div className={`aspect-[4/3] ${palettes[item.category]} relative`}>
                    <div className="grid h-full place-items-center p-6 text-center">
                      <span className="text-2xl font-bold tracking-tight">{item.client}</span>
                    </div>
                    <span className="absolute top-4 right-4 rounded-full bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                      {item.category}
                    </span>
                  </div>
                  <div className="bg-bg p-5">
                    <h2 className="text-base font-semibold tracking-tight md:text-lg">{item.title}</h2>
                    <p className="mt-1.5 text-sm text-ink-soft">{item.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {items.length === 0 ? (
            <p className="mt-10 text-center text-base text-ink-soft">
              No work in this category yet — check back soon.
            </p>
          ) : null}
        </Container>
      </Section>

      <FinalCTA />

      <JsonLd
        id="portfolio-jsonld"
        data={breadcrumbList([
          { name: "Home", href: "/" },
          { name: "Portfolio", href: "/portfolio" },
        ])}
      />
    </>
  );
}
