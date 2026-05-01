import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { industries: string[] };

export function ServiceIndustries({ industries }: Props) {
  return (
    <Section surface="alt">
      <Container>
        <SectionHeading
          eyebrow="Industries"
          title="Sectors we deliver this service for."
        />
        <ul className="mt-10 flex flex-wrap gap-3">
          {industries.map((name) => (
            <li
              key={name}
              className="rounded-full border border-line bg-bg px-5 py-2.5 text-sm font-medium tracking-tight"
            >
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
