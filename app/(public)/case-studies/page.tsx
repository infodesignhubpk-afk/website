import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { caseStudies } from "@/data/case-studies";
import { buildMetadata } from "@/lib/seo";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies | Design Hub Peshawar",
  description:
    "Detailed case studies from real Peshawar projects — branding, signage, print and digital — with the brief, the approach and the measurable outcome.",
  path: "/case-studies",
});

export default function CaseStudiesIndexPage() {
  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Case Studies", href: "/case-studies" }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Case studies</h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
              The longer-form story behind a few of our most-asked-about projects. Real brief, real approach, real numbers.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/case-studies/${c.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] bg-ink p-8 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand">{c.industry}</p>
                    <p className="mt-6 text-2xl font-bold tracking-tight">{c.client}</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <h2 className="text-lg font-semibold tracking-tight md:text-xl">{c.title}</h2>
                    <p className="text-sm text-ink-soft">{c.summary}</p>
                    <ul className="mt-auto grid grid-cols-2 gap-2 border-t border-line pt-4">
                      {c.metrics.slice(0, 2).map((m) => (
                        <li key={m.label}>
                          <p className="text-lg font-bold">{m.value}</p>
                          <p className="text-xs text-muted">{m.label}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCTA />

      <JsonLd
        id="case-studies-index-jsonld"
        data={breadcrumbList([{ name: "Home", href: "/" }, { name: "Case Studies", href: "/case-studies" }])}
      />
    </>
  );
}
