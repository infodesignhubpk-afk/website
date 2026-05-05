import type { Metadata } from "next";
import Link from "next/link";
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
import { ArrowRightIcon } from "@/components/ui/Icons";
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

  const ix = pool.findIndex((p) => p.slug === item.slug);
  const prev = ix > 0 ? pool[ix - 1] : null;
  const next = ix >= 0 && ix < pool.length - 1 ? pool[ix + 1] : null;

  return (
    <>
      <Section surface="white" className="pt-8 pb-12 md:pt-12 md:pb-16">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Portfolio", href: "/portfolio" },
              { name: item.title, href: `/portfolio/${item.slug}` },
            ]}
          />

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-soft">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
                {categoryLabels[item.category]} · {item.year}
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
                {item.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
                {item.summary}
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6 sm:max-w-md">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Client
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-ink">
                    {item.client}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Service
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-ink">
                    {categoryLabels[item.category]}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Year
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-ink">
                    {item.year}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Studio
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-ink">
                    Design Hub
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface">
                {hasImage ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 90vw, 420px"
                    className="object-contain p-10 md:p-14"
                    priority
                    unoptimized
                  />
                ) : (
                  <div
                    className={`grid h-full place-items-center p-10 text-center ${fallbackBg[item.category]}`}
                  >
                    <span className="text-3xl font-bold tracking-tight md:text-4xl">
                      {item.client}
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-3 text-center text-xs uppercase tracking-widest text-muted">
                {item.client} · {categoryLabels[item.category]}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {item.description ? (
        <Section surface="white" className="pt-0">
          <Container>
            <div className="mx-auto max-w-3xl border-t border-line pt-12 md:pt-16">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                About the project
              </h2>
              <div className="mt-6">
                <RichText html={item.description} />
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {prev || next ? (
        <Section surface="white" className="pt-0 pb-16 md:pb-20">
          <Container>
            <div className="grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/portfolio/${prev.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border border-line p-4 transition-colors hover:border-ink"
                >
                  <ArrowRightIcon size={18} className="shrink-0 rotate-180 text-muted group-hover:text-ink" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted">Previous</p>
                    <p className="truncate text-sm font-semibold text-ink md:text-base">{prev.title}</p>
                  </div>
                </Link>
              ) : <span />}
              {next ? (
                <Link
                  href={`/portfolio/${next.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border border-line p-4 transition-colors hover:border-ink sm:flex-row-reverse sm:text-right"
                >
                  <ArrowRightIcon size={18} className="shrink-0 text-muted group-hover:text-ink" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted">Next</p>
                    <p className="truncate text-sm font-semibold text-ink md:text-base">{next.title}</p>
                  </div>
                </Link>
              ) : <span />}
            </div>
          </Container>
        </Section>
      ) : null}

      {others.length > 0 ? (
        <Section surface="alt">
          <Container>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                More {categoryLabels[item.category].toLowerCase()} work
              </h2>
              <Link
                href="/portfolio"
                className="text-sm font-semibold tracking-tight text-ink hover:underline"
              >
                See full portfolio →
              </Link>
            </div>
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
