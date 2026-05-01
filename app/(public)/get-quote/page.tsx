import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Get a Free Quote | Design Hub Peshawar",
  description:
    "Brief us on your project in three short steps. Fixed-scope quote inside one working day. Branding, printing, signage and digital — Design Hub Peshawar.",
  path: "/get-quote",
});

export default function GetQuotePage() {
  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Get a Quote", href: "/get-quote" }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Get a free quote</h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
              Three short steps. We will reply within one working day with a fixed-scope quote, project plan and timeline.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="alt">
        <Container className="max-w-4xl">
          <QuoteForm />
        </Container>
      </Section>

      <JsonLd
        id="quote-jsonld"
        data={breadcrumbList([
          { name: "Home", href: "/" },
          { name: "Get a Quote", href: "/get-quote" },
        ])}
      />
    </>
  );
}
