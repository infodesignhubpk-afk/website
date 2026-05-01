import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { portfolio, getPortfolioItem } from "@/data/portfolio";
import { buildMetadata } from "@/lib/seo";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import type { ServiceCategory } from "@/types";

const palettes: Record<ServiceCategory, string> = {
  logo: "bg-ink text-white",
  branding: "bg-brand text-ink",
  signage: "bg-cta text-ink",
  printing: "bg-surface text-ink border border-line",
  vehicle: "bg-ink text-white",
  social: "bg-brand text-ink",
};

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return portfolio.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioItem(slug);
  if (!item) return {};
  return buildMetadata({
    title: `${item.title} | Portfolio`,
    description: item.summary,
    path: `/portfolio/${item.slug}`,
  });
}

export default async function PortfolioItemPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getPortfolioItem(slug);
  if (!item) notFound();

  const others = portfolio.filter((p) => p.slug !== item.slug && p.category === item.category).slice(0, 3);

  return (
    <>
      <Section surface="white" className="pt-8 pb-10 md:pt-12 md:pb-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Portfolio", href: "/portfolio" },
              { name: item.title, href: `/portfolio/${item.slug}` },
            ]}
          />
          <div className="mt-5 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{item.category} · {item.year}</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">{item.title}</h1>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-ink-soft">{item.summary}</p>
          </div>
        </Container>
      </Section>

      <Section surface="white" className="pt-0">
        <Container>
          <div className={`aspect-[16/9] rounded-2xl ${palettes[item.category]}`}>
            <div className="grid h-full place-items-center p-12 text-center">
              <span className="text-4xl md:text-6xl font-bold tracking-tight">{item.client}</span>
            </div>
          </div>
        </Container>
      </Section>

      {item.description ? (
        <Section surface="white">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="text-2xl font-semibold tracking-tight">About the project</h2>
                <dl className="mt-6 space-y-4 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Client</dt>
                    <dd className="mt-1">{item.client}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Service</dt>
                    <dd className="mt-1 capitalize">{item.category}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Year</dt>
                    <dd className="mt-1">{item.year}</dd>
                  </div>
                </dl>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base md:text-lg leading-relaxed text-ink">{item.description}</p>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {others.length > 0 ? (
        <Section surface="alt">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">More like this</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/portfolio/${p.slug}`} className="group block overflow-hidden rounded-2xl border border-line bg-bg">
                    <div className={`aspect-[4/3] ${palettes[p.category]}`}>
                      <div className="grid h-full place-items-center p-6 text-center">
                        <span className="text-xl font-bold tracking-tight">{p.client}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                      <p className="mt-1 text-sm text-ink-soft">{p.summary}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <FinalCTA />

      <JsonLd
        id={`portfolio-item-${item.slug}`}
        data={breadcrumbList([
          { name: "Home", href: "/" },
          { name: "Portfolio", href: "/portfolio" },
          { name: item.title, href: `/portfolio/${item.slug}` },
        ])}
      />
    </>
  );
}

export const dynamicParams = false;
