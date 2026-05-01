import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolio } from "@/data/portfolio";
import type { ServiceCategory } from "@/types";

const palettes: Record<ServiceCategory, string> = {
  logo: "bg-ink",
  branding: "bg-brand",
  signage: "bg-cta",
  printing: "bg-surface",
  vehicle: "bg-ink",
  social: "bg-brand",
};

const categoryLabels: Record<ServiceCategory, string> = {
  logo: "Logo",
  branding: "Branding",
  signage: "Signage",
  printing: "Print",
  vehicle: "Vehicle",
  social: "Social",
};

export function PortfolioPreview() {
  const items = portfolio.slice(0, 6);
  return (
    <Section surface="white">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Portfolio"
            title="Recent work from across Peshawar."
            description="A small selection of identity, signage, print and digital work shipped over the last 12 months. Click through for the full archive."
          />
          <Link href="/portfolio" className="text-sm font-semibold tracking-tight text-ink hover:underline">
            View all work →
          </Link>
        </div>

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/portfolio/${item.slug}`}
                className="group block overflow-hidden rounded-2xl border border-line"
              >
                <div className={`aspect-[4/3] ${palettes[item.category]} relative overflow-hidden`}>
                  <div className="absolute inset-0 grid place-items-center p-6 text-center">
                    <span className={`text-3xl font-bold tracking-tight ${item.category === "branding" || item.category === "signage" || item.category === "social" ? "text-ink" : "text-white"}`}>
                      {item.client}
                    </span>
                  </div>
                  <span className="absolute top-4 right-4 rounded-full bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                    {categoryLabels[item.category]}
                  </span>
                </div>
                <div className="bg-bg p-5">
                  <h3 className="text-base font-semibold tracking-tight md:text-lg">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{item.summary}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
