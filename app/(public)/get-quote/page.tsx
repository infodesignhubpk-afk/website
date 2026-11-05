import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import { listPublishedServices } from "@/lib/admin/services";

export const metadata: Metadata = buildMetadata({
  title: "Get a Quote | Design Hub Peshawar",
  description:
    "Brief us on your project in three short steps. Fixed-scope quote inside one working day. Branding, printing, signage and digital — Design Hub Peshawar.",
  path: "/get-quote",
});

export default async function GetQuotePage() {
  const services = await listPublishedServices();
  return (
    <>
      <PageHero
        title="Get a quote"
        description="Three short steps. We will reply within one working day with a fixed-scope quote, project plan and timeline."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Get a Quote", href: "/get-quote" },
        ]}
      />

      <Section surface="alt">
        <Container className="max-w-4xl">
          <QuoteForm services={services.map(({ slug, keyword }) => ({ slug, keyword }))} />
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
