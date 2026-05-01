import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/utils";
import type { Service, ServiceFAQ } from "@/types";

type JsonLdNode = Record<string, unknown>;

export function organization(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.url, "/logo.png"),
    foundingDate: String(siteConfig.founded),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "customer service",
        areaServed: "PK",
        availableLanguage: ["en", "ur", "ps"],
      },
    ],
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };
}

export function website(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en-PK",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusiness(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}#localbusiness`,
    name: siteConfig.name,
    image: absoluteUrl(siteConfig.url, "/og-default.png"),
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "PKR",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:30",
        closes: "20:00",
      },
    ],
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    areaServed: { "@type": "City", name: "Peshawar" },
  };
}

type Crumb = { name: string; href: string };

export function breadcrumbList(crumbs: Crumb[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(siteConfig.url, c.href),
    })),
  };
}

export function faqPage(faqs: ServiceFAQ[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function service(s: Service): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.h1,
    serviceType: s.keyword,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${siteConfig.url}#localbusiness`,
      name: siteConfig.name,
    },
    areaServed: { "@type": "City", name: "Peshawar" },
    description: s.metaDescription,
    url: absoluteUrl(siteConfig.url, `/services/${s.slug}`),
  };
}

export function review(name: string, business: string, quote: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewBody: quote,
    author: { "@type": "Person", name },
    publisher: { "@type": "Organization", name: business },
  };
}
