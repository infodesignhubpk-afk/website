import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { homepageFAQs } from "@/data/faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPage } from "@/lib/schema";
import { getSite } from "@/lib/admin/site";

export async function HomeFAQ() {
  const site = await getSite();
  const faqs = homepageFAQs({
    address: `${site.address.street}, ${site.address.locality}`,
    email: site.email,
  });
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
            <div className="relative mt-10 aspect-[16/9]">
              <Image
                src="https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777736175782-4uszoi-illustration-map-of-peshawar.jpeg"
                alt="Illustrated map of Peshawar — the city we work across every day"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-contain"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <Accordion items={faqs} idPrefix="home-faq" />
          </div>
        </div>
      </Container>
      <JsonLd data={faqPage(faqs)} id="home-faq-jsonld" />
    </Section>
  );
}
