import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listPublishedPortfolio } from "@/lib/admin/portfolio";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";

export async function PortfolioPreview() {
  const items = (await listPublishedPortfolio()).slice(0, 6);
  if (items.length === 0) return null;
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
              <PortfolioCard item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
