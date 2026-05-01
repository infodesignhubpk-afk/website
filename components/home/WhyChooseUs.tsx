import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyChooseUs } from "@/data/faqs";

export function WhyChooseUs() {
  return (
    <Section surface="alt">
      <Container>
        <SectionHeading
          eyebrow="Why Design Hub"
          title="Six reasons businesses keep coming back."
          description="We are not the cheapest studio in Peshawar. We are the most accountable. Here is what that looks like in practice."
        />
        <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((r, i) => (
            <li key={r.title} className="rounded-2xl border border-line bg-bg p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-widest text-muted">0{i + 1}</span>
                <span aria-hidden className="h-2 w-2 rounded-full bg-brand" />
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight md:text-2xl">{r.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">{r.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
