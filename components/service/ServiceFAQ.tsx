import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import type { ServiceFAQ as FAQ } from "@/types";

type Props = { faqs: FAQ[]; keyword: string };

export function ServiceFAQ({ faqs, keyword }: Props) {
  return (
    <Section surface="white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="FAQ"
              title={<>{keyword} — common questions.</>}
              description="If your question is not here, send it via WhatsApp and a project manager will reply the same day."
            />
          </div>
          <div className="lg:col-span-7">
            <Accordion items={faqs} idPrefix={`faq-${keyword.toLowerCase().replace(/\s+/g, "-")}`} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
