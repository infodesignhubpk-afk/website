import Image from "next/image";
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
            <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface p-4">
              <Image
                src="https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777736175782-4uszoi-illustration-map-of-peshawar.jpeg"
                alt="Illustrated map of Peshawar — the city we work across every day"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-contain p-4"
              />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-bg/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink shadow-sm backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  Based in Peshawar
                </span>
                <p className="mt-3 text-sm font-semibold leading-tight text-ink">
                  Working across University Road, Hayatabad, Saddar &amp; Ring Road.
                </p>
              </div>
            </div>
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
