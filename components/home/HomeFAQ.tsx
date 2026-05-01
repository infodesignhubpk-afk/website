import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { homepageFAQs } from "@/data/faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPage } from "@/lib/schema";

export function HomeFAQ() {
  return (
    <Section surface="white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Questions"
              title="Frequently asked questions."
              description="The things businesses in Peshawar ask before they commission us. If your question is not here, send it to us on WhatsApp."
            />
          </div>
          <div className="lg:col-span-7">
            <Accordion items={homepageFAQs} idPrefix="home-faq" />
          </div>
        </div>
      </Container>
      <JsonLd data={faqPage(homepageFAQs)} id="home-faq-jsonld" />
    </Section>
  );
}
