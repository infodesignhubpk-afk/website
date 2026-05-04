import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { processSteps } from "@/data/faqs";

export function ProcessSteps() {
  return (
    <Section surface="ink" className="text-white">
      <Container>
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
            Process
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            A four-step process. Tested on 500+ projects.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-white/70">
            Brief, concept, production, delivery. We agree the scope up front, sign off direction at the concept stage, and never start the meter running on a vague brief.
          </p>
        </div>
        <ol className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.number} className="relative rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8">
              <span className="text-xs font-bold uppercase tracking-widest text-brand">Step {step.number}</span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
