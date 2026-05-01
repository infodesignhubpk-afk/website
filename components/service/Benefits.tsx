import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ServiceBenefit } from "@/types";

type Props = {
  benefits: ServiceBenefit[];
};

export function Benefits({ benefits }: Props) {
  return (
    <Section surface="alt">
      <Container>
        <SectionHeading
          eyebrow="Benefits"
          title="What you actually get when you work with us."
        />
        <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <li key={b.title} className="rounded-2xl border border-line bg-bg p-6 md:p-8">
              <span className="text-sm font-bold tracking-widest text-muted">0{i + 1}</span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight md:text-2xl">{b.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">{b.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
