import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/services";
import type { ServiceCategory } from "@/types";

const categoryImages: Record<ServiceCategory, string> = {
  logo: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777716960247-hdtxy9-designer-creating-logo-brand-ide-202605021513-1.jpeg",
  branding: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777716960247-hdtxy9-designer-creating-logo-brand-ide-202605021513-1.jpeg",
  printing: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777716962989-g4pmhr-printing-press-agency-with-designer-202605021503-1.jpeg",
  signage: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777716961369-fdl2bb-signboard-on-fast-food-restaurant-202605021508-1.jpeg",
  vehicle: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777716961369-fdl2bb-signboard-on-fast-food-restaurant-202605021508-1.jpeg",
  social: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777716963812-izy0ob-gemini-generated-image-e3i35be3i35be3i3-1.png",
};

const categoryLabels: Record<ServiceCategory, string> = {
  logo: "Identity",
  branding: "Branding",
  printing: "Print",
  signage: "Signage",
  vehicle: "Vehicle",
  social: "Digital",
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
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                  <Image
                    src={categoryImages[s.category]}
                    alt={s.keyword}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-bg/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink backdrop-blur">
                    {categoryLabels[s.category]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{s.keyword}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {s.metaDescription.split(".")[0]}.
                  </p>
                  <span className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink">
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
