import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import { getSite } from "@/lib/admin/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact | Design Hub Peshawar",
  description:
    "Talk to Design Hub. Office on University Road, Peshawar. WhatsApp, call or email — most enquiries answered within one working day.",
  path: "/contact",
});

export default async function ContactPage() {
  const site = await getSite();
  const mapsQuery = encodeURIComponent(
    `${site.address.street}, ${site.address.locality}, ${site.address.region}`,
  );
  const mapEmbed = `https://www.google.com/maps?q=${site.geo.latitude},${site.geo.longitude}&hl=en&z=14&output=embed`;
  const mapsHref = `https://www.google.com/maps?q=${mapsQuery}`;

  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Talk to us</h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
              Whether you need a logo, a hoarding or a multi-month branding engagement — start with a quick message and we will reply within one working day.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line p-6 md:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Reach us</h2>
                <ul className="mt-6 space-y-5 text-base">
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Phone / WhatsApp</p>
                    <p className="mt-1">
                      <a href={`tel:${site.phone}`} className="font-semibold hover:underline">
                        {site.phoneDisplay}
                      </a>
                    </p>
                  </li>
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Email</p>
                    <p className="mt-1">
                      <a href={`mailto:${site.email}`} className="font-semibold hover:underline">
                        {site.email}
                      </a>
                    </p>
                  </li>
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Office</p>
                    <p className="mt-1">{site.address.street}</p>
                    <p>
                      {site.address.locality}, {site.address.region}
                    </p>
                    <p className="mt-2">
                      <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold underline">
                        Open in Google Maps
                      </a>
                    </p>
                  </li>
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Hours</p>
                    {site.openingHours.map((h) => (
                      <p key={h.days} className="mt-1">
                        <span className="font-semibold">{h.days}</span> · {h.hours}
                      </p>
                    ))}
                  </li>
                </ul>
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl border border-line">
                <iframe
                  src={mapEmbed}
                  title={`${site.name} office map`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-line p-6 md:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Send us a message</h2>
                <p className="mt-2 text-base text-ink-soft">
                  Tell us about your project — quantity, deadline, references — and we will reply within one working day.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd
        id="contact-jsonld"
        data={breadcrumbList([{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }])}
      />
    </>
  );
}
