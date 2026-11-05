import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/admin/services";
import { buildMetadata } from "@/lib/seo";
import { ServiceHero } from "@/components/service/ServiceHero";
import { Overview } from "@/components/service/Overview";
import { Benefits } from "@/components/service/Benefits";
import { Process } from "@/components/service/Process";
import { UseCases } from "@/components/service/UseCases";
import { ServicePortfolio } from "@/components/service/ServicePortfolio";
import { ServiceIndustries } from "@/components/service/ServiceIndustries";
import { ServiceFAQ } from "@/components/service/ServiceFAQ";
import { RelatedServices } from "@/components/service/RelatedServices";
import { ServiceCTA } from "@/components/service/ServiceCTA";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList, faqPage, service as serviceSchema } from "@/lib/schema";

type Params = { slug: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) return {};
  return buildMetadata({
    title: s.metaTitle,
    description: s.metaDescription,
    path: `/services/${s.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) notFound();

  return (
    <>
      <ServiceHero service={s} />
      <Overview keyword={s.keyword} paragraphs={s.overview} />
      {s.benefits.length ? <Benefits benefits={s.benefits} /> : null}
      {s.process.length ? <Process steps={s.process} /> : null}
      {s.useCases.length ? <UseCases keyword={s.keyword} useCases={s.useCases} /> : null}
      <ServicePortfolio category={s.category} />
      {s.industries.length ? <ServiceIndustries industries={s.industries} /> : null}
      {s.faqs.length ? <ServiceFAQ faqs={s.faqs} keyword={s.keyword} /> : null}
      {s.relatedSlugs.length ? <RelatedServices slugs={s.relatedSlugs} /> : null}
      <ServiceCTA serviceName={s.keyword} ctaText={s.hero.ctaText} />
      <FinalCTA
        title={`Need ${s.keyword.toLowerCase()} in Peshawar — done right?`}
        description="Brief us in five minutes. Fixed quote inside one working day."
      />

      <JsonLd
        id={`service-jsonld-${s.slug}`}
        data={[
          serviceSchema(s),
          breadcrumbList([
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
            { name: s.keyword, href: `/services/${s.slug}` },
          ]),
          ...(s.faqs.length ? [faqPage(s.faqs)] : []),
        ]}
      />
    </>
  );
}
