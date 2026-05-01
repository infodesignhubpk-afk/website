import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolio } from "@/data/portfolio";
import type { ServiceCategory } from "@/types";

const palettes: Record<ServiceCategory, string> = {
  logo: "bg-ink text-white",
  branding: "bg-brand text-ink",
  signage: "bg-cta text-ink",
  printing: "bg-surface text-ink border border-line",
  vehicle: "bg-ink text-white",
  social: "bg-brand text-ink",
};

type Props = { category: ServiceCategory };

export function ServicePortfolio({ category }: Props) {
  const items = portfolio.filter((p) => p.category === category).slice(0, 6);
  if (items.length === 0) return null;
  return (
    <Section surface="white">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Portfolio"
            title="Recent work in this service line."
          />
          <Link href="/portfolio" className="text-sm font-semibold tracking-tight text-ink hover:underline">
            See full portfolio →
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/portfolio/${item.slug}`}
                className="group block overflow-hidden rounded-2xl border border-line"
              >
                <div className={`aspect-[4/3] ${palettes[item.category]}`}>
                  <div className="grid h-full place-items-center p-6 text-center">
                    <span className="text-2xl font-bold tracking-tight">{item.client}</span>
                  </div>
                </div>
                <div className="bg-bg p-5">
                  <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
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
