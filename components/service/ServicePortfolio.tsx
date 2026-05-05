import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listPublishedPortfolio } from "@/lib/admin/portfolio";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import type { ServiceCategory } from "@/types";

type Props = { category: ServiceCategory };

export async function ServicePortfolio({ category }: Props) {
  const portfolio = await listPublishedPortfolio();
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
              <PortfolioCard item={item} showCategory={false} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
