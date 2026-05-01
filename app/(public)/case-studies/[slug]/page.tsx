import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { buildMetadata } from "@/lib/seo";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return buildMetadata({
    title: `${c.title} | Case Study`,
    description: c.summary,
    path: `/case-studies/${c.slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();

  return (
    <>
      <Section surface="white" className="pt-8 pb-10 md:pt-12 md:pb-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Case Studies", href: "/case-studies" },
              { name: c.client, href: `/case-studies/${c.slug}` },
            ]}
          />
          <div className="mt-5 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {c.industry} · {c.client}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">{c.title}</h1>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-ink-soft">{c.summary}</p>
          </div>
        </Container>
      </Section>

      <Section surface="white" className="pt-0">
        <Container>
          <ul className="grid gap-6 rounded-2xl border border-line bg-surface p-6 md:grid-cols-4 md:p-10">
            {c.metrics.map((m) => (
              <li key={m.label}>
                <p className="text-3xl font-bold tracking-tight md:text-5xl">{m.value}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted">{m.label}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <aside className="lg:col-span-3">
              <ul className="sticky top-24 space-y-3 text-sm font-semibold uppercase tracking-wider text-muted">
                <li><a href="#challenge" className="hover:text-ink">Challenge</a></li>
                <li><a href="#approach" className="hover:text-ink">Approach</a></li>
                <li><a href="#outcome" className="hover:text-ink">Outcome</a></li>
              </ul>
            </aside>
            <div className="lg:col-span-9 space-y-12">
              <section id="challenge">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Challenge</h2>
                <p className="mt-4 text-base md:text-lg leading-relaxed text-ink">{c.challenge}</p>
              </section>
              <section id="approach">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Approach</h2>
                <p className="mt-4 text-base md:text-lg leading-relaxed text-ink">{c.approach}</p>
              </section>
              <section id="outcome">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Outcome</h2>
                <p className="mt-4 text-base md:text-lg leading-relaxed text-ink">{c.outcome}</p>
              </section>
            </div>
          </div>
        </Container>
      </Section>

      <FinalCTA />

      <JsonLd
        id={`case-study-${c.slug}-jsonld`}
        data={breadcrumbList([
          { name: "Home", href: "/" },
          { name: "Case Studies", href: "/case-studies" },
          { name: c.client, href: `/case-studies/${c.slug}` },
        ])}
      />
    </>
  );
}

export const dynamicParams = false;
