import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  keyword: string;
  paragraphs: string[];
};

export function Overview({ keyword, paragraphs }: Props) {
  return (
    <Section surface="white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Overview"
              title={<>Why {keyword} matters in Peshawar.</>}
            />
          </div>
          <div className="lg:col-span-8">
            <div className="space-y-5 text-base md:text-lg leading-relaxed text-ink">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
