import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/services";
import type { ServiceCategory } from "@/types";

const categoryStyles: Record<ServiceCategory, string> = {
  logo: "bg-ink text-white",
  branding: "bg-surface text-ink",
  printing: "bg-bg text-ink border border-line",
  signage: "bg-brand/30 text-ink",
  vehicle: "bg-bg text-ink border border-line",
  social: "bg-ink text-white",
};

export function ServicesGrid() {
  return (
    <Section id="services" surface="white">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Services"
            title={<>Ten services. One studio. <span className="text-muted">Zero handoffs.</span></>}
            description="Everything you need to launch, run and scale a brand in Peshawar — from the first sketch of a logo to the last billboard on Ring Road."
          />
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-ink hover:underline"
          >
            See all services
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className={`group relative flex h-full flex-col justify-between gap-8 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 ${categoryStyles[s.category]}`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  {s.category === "logo" ? "Identity" : s.category === "branding" ? "Branding" : s.category === "signage" ? "Signage" : s.category === "printing" ? "Print" : s.category === "vehicle" ? "Vehicle" : "Digital"}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{s.keyword}</h3>
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
  );
}
