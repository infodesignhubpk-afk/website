import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
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
      <PageHero
        title="Get a free quote"
        description="Three short steps. We will reply within one working day with a fixed-scope quote, project plan and timeline."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Get a Quote", href: "/get-quote" },
        ]}
      />

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
