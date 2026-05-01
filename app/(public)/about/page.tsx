import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Testimonials } from "@/components/home/Testimonials";
import { buildMetadata } from "@/lib/seo";
import { trustStats } from "@/data/site";
import { getSite } from "@/lib/admin/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "About | Design Hub Peshawar",
  description:
    "About Design Hub — a Peshawar-based branding, printing, signage and digital marketing studio. Senior designers, in-house production, accountable delivery.",
  path: "/about",
});

const principles = [
  {
    title: "Design that earns its keep",
    body:
      "Every brand we build has to do a job in the real world — pull customers off the street, get the catalogue pulled out at a meeting, get a flex banner noticed at 60 km/h. Beautiful is not enough.",
  },
  {
    title: "Local context first",
    body:
      "Peshawar's print, signage and media landscape has its own rules. We design for the city's actual sight-lines, paper stocks, signage permissions and audience rhythms — not for a generic Behance audience.",
  },
  {
    title: "One studio, every touchpoint",
    body:
      "Identity, brochures, signage, vehicle wraps and ads handled in one place. Fewer vendors, fewer mistranslations between disciplines, more accountability when something needs to change at the last minute.",
  },
  {
    title: "Senior designers on every project",
    body:
      "You will not be handed off to a junior after the kickoff call. The senior who scoped the work owns delivery and is on the WhatsApp thread until handover.",
  },
];

export default async function AboutPage() {
  const site = await getSite();
  return (
    <>
      <Section surface="white" className="pt-8 pb-10 md:pt-12 md:pb-12">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
          <div className="mt-5 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                A Peshawar studio building brands that work outside the screen.
              </h1>
              <p className="mt-3 max-w-3xl text-base md:text-lg leading-relaxed text-ink-soft">
                {site.name} started in {site.founded} with a simple idea: a Peshawar business should not have to coordinate five vendors to get a logo, a banner, a signboard and a social campaign that look like they belong to the same brand. Seven years and {trustStats[0].value} projects later, that is still what we do — under one roof.
              </p>
            </div>
            <aside className="lg:col-span-4">
              <dl className="grid grid-cols-3 gap-6 lg:grid-cols-1">
                {trustStats.map((s) => (
                  <div key={s.label} className="border-l-2 border-brand pl-4">
                    <dt className="text-xs uppercase tracking-wider text-muted">{s.label}</dt>
                    <dd className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </Container>
      </Section>

      <Section surface="white" className="pt-0">
        <Container>
          <SectionHeading
            eyebrow="Principles"
            title="What we believe about good design work."
          />
          <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.title} className="rounded-2xl border border-line p-6 md:p-8">
                <span className="text-sm font-bold tracking-widest text-muted">0{i + 1}</span>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Testimonials />
      <FinalCTA />

      <JsonLd
        id="about-jsonld"
        data={breadcrumbList([{ name: "Home", href: "/" }, { name: "About", href: "/about" }])}
      />
    </>
  );
}
