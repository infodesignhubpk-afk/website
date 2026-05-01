import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getRelatedServices } from "@/data/services";

type Props = { slugs: string[] };

export function RelatedServices({ slugs }: Props) {
  const related = getRelatedServices(slugs);
  return (
    <Section surface="alt">
      <Container>
        <SectionHeading
          eyebrow="Related"
          title="Often paired with this service."
        />
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {related.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-bg p-6 transition-all hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold tracking-tight">{s.keyword}</h3>
                <p className="mt-2 text-sm text-ink-soft">{s.metaDescription.split(".")[0]}.</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">
                  See service
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
