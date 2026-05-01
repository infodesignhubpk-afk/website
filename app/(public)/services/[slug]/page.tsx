import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getService, serviceSlugs } from "@/data/services";
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

export function generateStaticParams(): Params[] {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return buildMetadata({
    title: s.metaTitle,
    description: s.metaDescription,
    path: `/services/${s.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  return (
    <>
      <ServiceHero service={s} />
      <Overview keyword={s.keyword} paragraphs={s.overview} />
      <Benefits benefits={s.benefits} />
      <Process steps={s.process} />
      <UseCases keyword={s.keyword} useCases={s.useCases} />
      <ServicePortfolio category={s.category} />
      <ServiceIndustries industries={s.industries} />
      <ServiceFAQ faqs={s.faqs} keyword={s.keyword} />
      <RelatedServices slugs={s.relatedSlugs} />
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
          faqPage(s.faqs),
        ]}
      />
    </>
  );
}

export const dynamicParams = false;

export const _ALL = services;
