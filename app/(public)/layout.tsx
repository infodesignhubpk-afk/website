import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { organization, website } from "@/lib/schema";
import { getSite } from "@/lib/admin/site";
import { CartProvider } from "@/lib/cart-context";

export const dynamic = "force-dynamic";

function localBusinessFromSite(site: Awaited<ReturnType<typeof getSite>>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}#localbusiness`,
    name: site.name,
    image: site.logoUrl || `${site.url}/og-default.png`,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    priceRange: "PKR",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:30",
        closes: "20:00",
      },
    ],
    sameAs: Object.values(site.social).filter(Boolean),
    areaServed: { "@type": "City", name: "Peshawar" },
  };
}

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const site = await getSite();
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col pb-12 md:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton number={site.whatsappNumber} />
        <StickyMobileCTA phone={site.phone} />
        <JsonLd data={[organization(), website(), localBusinessFromSite(site)]} id="root-jsonld" />
      </div>
    </CartProvider>
  );
}
