import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { keyword: string; useCases: string[] };

export function UseCases({ keyword, useCases }: Props) {
  return (
    <Section surface="alt">
      <Container>
        <SectionHeading
          eyebrow="Use cases"
          title={<>Where {keyword} works hardest in Peshawar.</>}
          description="The specific scenarios our clients commission this service for, drawn from real projects shipped over the last 12 months."
        />
        <ul className="mt-12 grid gap-3 md:mt-16 md:grid-cols-2">
          {useCases.map((u, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl border border-line bg-bg p-5">
              <span aria-hidden className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6.5l3 3 5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-base text-ink">{u}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
