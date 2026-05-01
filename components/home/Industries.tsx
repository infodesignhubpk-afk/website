import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries } from "@/data/industries";

export function Industries() {
  return (
    <Section surface="white">
      <Container>
        <SectionHeading
          eyebrow="Industries"
          title="The kinds of businesses we partner with."
          description="Sectors we work in regularly across Peshawar and KP. Industry context matters — design that works for retail rarely works for healthcare."
        />
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((i) => (
            <li key={i.name} className="rounded-2xl border border-line p-6">
              <h3 className="text-lg font-semibold tracking-tight">{i.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{i.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
