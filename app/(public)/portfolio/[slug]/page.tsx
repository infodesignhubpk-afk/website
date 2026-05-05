import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { listPublishedPortfolio, getPortfolioItemBySlug } from "@/lib/admin/portfolio";
import type { AdminPortfolioItem } from "@/types/admin";
import { buildMetadata } from "@/lib/seo";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList, creativeWork } from "@/lib/schema";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import type { ServiceCategory } from "@/types";

const categoryLabels: Record<ServiceCategory, string> = {
  logo: "Logo / Identity",
  branding: "Branding",
  signage: "Signage",
  printing: "Print",
  vehicle: "Vehicle",
  social: "Social / Digital",
};

const fallbackBg: Record<ServiceCategory, string> = {
  logo: "bg-ink text-white",
  branding: "bg-brand text-ink",
  signage: "bg-cta text-ink",
  printing: "bg-surface text-ink border border-line",
  vehicle: "bg-ink text-white",
  social: "bg-brand text-ink",
};

type Params = { slug: string };

async function loadItem(
  slug: string,
): Promise<{ item: AdminPortfolioItem | null; pool: AdminPortfolioItem[] }> {
  const pool = await listPublishedPortfolio();
  const item = await getPortfolioItemBySlug(slug);
  return { item: item && item.published ? item : null, pool };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { item } = await loadItem(slug);
  if (!item) return {};
  return buildMetadata({
    title: `${item.title} | Portfolio`,
    description: item.summary,
    path: `/portfolio/${item.slug}`,
  });
}

export default async function PortfolioItemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const { item, pool } = await loadItem(slug);
  if (!item) notFound();

  const others = pool
    .filter((p) => p.slug !== item.slug && p.category === item.category)
    .slice(0, 3);
  const hasImage = Boolean(item.image && /^https?:\/\//.test(item.image));

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
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {categoryLabels[item.category]} · {item.year}
            </p>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
              {item.title}
            </h1>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-ink-soft">
              {item.summary}
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white" className="pt-0">
        <Container>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-surface">
            {hasImage ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-contain p-6 md:p-10"
                priority
                unoptimized
              />
            ) : (
              <div
                className={`grid h-full place-items-center p-12 text-center ${fallbackBg[item.category]}`}
              >
                <span className="text-4xl md:text-6xl font-bold tracking-tight">
                  {item.client}
                </span>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section surface="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                About the project
              </h2>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Client
                  </dt>
                  <dd className="mt-1 text-base">{item.client}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Service
                  </dt>
                  <dd className="mt-1 text-base">
                    {categoryLabels[item.category]}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Year
                  </dt>
                  <dd className="mt-1 text-base">{item.year}</dd>
                </div>
              </dl>
            </aside>
            <div className="lg:col-span-8">
              {item.description ? (
                <RichText html={item.description} />
              ) : (
                <p className="text-base md:text-lg leading-relaxed text-ink-soft">
                  {item.summary}
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {others.length > 0 ? (
        <Section surface="alt">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              More like this
            </h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <PortfolioCard item={p} showCategory={false} />
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
      <JsonLd id={`portfolio-creativework-${item.slug}`} data={creativeWork(item)} />
    </>
  );
}
