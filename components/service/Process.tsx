import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ServiceProcessStep } from "@/types";

type Props = { steps: ServiceProcessStep[] };

export function Process({ steps }: Props) {
  return (
    <Section surface="white">
      <Container>
        <SectionHeading
          eyebrow="Process"
          title="How we run the project."
          description="A predictable rhythm from kickoff to delivery. Tracked weekly, signed off in writing."
        />
        <ol className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-bg p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-bg text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold tracking-tight md:text-xl">{s.title}</h3>
              </div>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">{s.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
