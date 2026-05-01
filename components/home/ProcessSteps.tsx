import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/faqs";

export function ProcessSteps() {
  return (
    <Section surface="ink" className="text-white">
      <Container>
        <SectionHeading
          eyebrow="Process"
          title={<span className="text-white">A four-step process. Tested on 500+ projects.</span>}
          description={<span className="text-white/70">Brief, concept, production, delivery. We agree the scope up front, sign off direction at the concept stage, and never start the meter running on a vague brief.</span>}
        />
        <ol className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.number} className="relative rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8">
              <span className="text-xs font-bold uppercase tracking-widest text-brand">Step {step.number}</span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
