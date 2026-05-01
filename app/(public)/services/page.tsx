import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import type { ServiceCategory } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "Services | Branding, Printing, Signage & Digital in Peshawar",
  description:
    "Full-service design agency in Peshawar. Logo design, branding, graphic design, printing, signage, vehicle branding and Meta ads. One studio, every touchpoint.",
  path: "/services",
});

const palettes: Record<ServiceCategory, string> = {
  logo: "bg-ink text-white",
  branding: "bg-surface text-ink border border-line",
  printing: "bg-bg text-ink border border-line",
  signage: "bg-brand/30 text-ink",
  vehicle: "bg-bg text-ink border border-line",
  social: "bg-ink text-white",
};

export default function ServicesIndexPage() {
  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Services
            </h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
              Ten services that cover the full journey of a brand in Peshawar — from the first sketch of a logo to the last hoarding on Ring Road. Pick the closest match and we will scope from there.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className={`group relative flex h-full flex-col justify-between gap-8 rounded-2xl p-6 md:p-8 transition-all hover:-translate-y-1 ${palettes[s.category]}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    {s.category}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{s.keyword}</h2>
                    <p className="mt-2 text-sm leading-relaxed opacity-80">
                      {s.metaDescription.split(".")[0]}.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                      Learn more
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCTA />

      <JsonLd
        id="services-index-jsonld"
        data={breadcrumbList([
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ])}
      />
    </>
  );
}
