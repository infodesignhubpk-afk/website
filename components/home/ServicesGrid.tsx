import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { listPublishedServices } from "@/lib/admin/services";
import type { ServiceCategory } from "@/types";

const categoryLabel: Record<ServiceCategory, string> = {
  logo: "Identity",
  branding: "Branding",
  printing: "Print",
  signage: "Signage",
  vehicle: "Vehicle",
  social: "Digital",
};

const iconBadgeStyle: Record<ServiceCategory, string> = {
  logo: "bg-gradient-to-br from-ink to-ink-soft text-brand",
  branding: "bg-gradient-to-br from-brand/30 to-brand/10 text-ink",
  printing: "bg-gradient-to-br from-cta/25 to-cta/5 text-ink",
  signage: "bg-gradient-to-br from-brand/40 to-brand/15 text-ink",
  vehicle: "bg-gradient-to-br from-ink to-ink-soft text-brand",
  social: "bg-gradient-to-br from-cta/30 to-brand/15 text-ink",
};

const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

function countWord(n: number): string {
  return COUNT_WORDS[n] ?? String(n);
}

export async function ServicesGrid() {
  const services = await listPublishedServices();
  return (
    <Section id="services" surface="white">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Services"
            title={<>{countWord(services.length)} services. One studio. <span className="text-muted">Zero handoffs.</span></>}
            description="Everything you need to launch, run and scale a brand in Peshawar — from the first sketch of a logo to the last billboard on Ring Road."
          />
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-ink hover:underline"
          >
            See all services
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] md:p-7"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl ${iconBadgeStyle[s.category]} shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-2deg]`}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_20%,_rgba(255,255,255,0.5)_0%,_rgba(255,255,255,0)_60%)]"
                    />
                    <ServiceIcon slug={s.slug} size={34} className="relative" />
                  </span>
                  <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ink-soft">
                    {categoryLabel[s.category]}
                  </span>
                </div>

                <div className="mt-7 flex flex-1 flex-col">
                  <h3 className="text-xl font-bold tracking-tight md:text-2xl">{s.keyword}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-[15px]">
                    {s.metaDescription.split(".")[0]}.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                  <span className="text-sm font-semibold tracking-tight text-ink">
                    Learn more
                  </span>
                  <span
                    aria-hidden
                    className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-bg"
                  >
                    <ArrowRightIcon size={14} />
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
