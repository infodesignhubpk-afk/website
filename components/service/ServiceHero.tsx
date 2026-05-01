import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { whatsappLink } from "@/lib/utils";
import type { Service } from "@/types";
import { getSite } from "@/lib/admin/site";

type Props = { service: Service };

export async function ServiceHero({ service }: Props) {
  const site = await getSite();
  return (
    <section className="relative overflow-hidden border-b border-line bg-bg pt-8 pb-16 md:pt-12 md:pb-24">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[55%] bg-[radial-gradient(70%_55%_at_30%_0%,_rgba(162,212,94,0.22)_0%,_rgba(255,255,255,0)_70%)]"
      />
      <Container>
        <Breadcrumbs
          className="mb-8"
          items={[
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
            { name: service.keyword, href: `/services/${service.slug}` },
          ]}
        />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {service.keyword} · Peshawar
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {service.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-xl leading-relaxed text-ink-soft">
              {service.hero.subheading}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#enquire" size="lg">
                {service.hero.ctaText}
              </Button>
              <Button
                href={whatsappLink(site.whatsappNumber, `Hi, I would like to enquire about ${service.keyword} in Peshawar.`)}
                variant="secondary"
                size="lg"
              >
                WhatsApp Us
              </Button>
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
                Why {site.name}
              </h2>
              <ul className="mt-4 space-y-3 text-sm">
                {service.benefits.slice(0, 4).map((b) => (
                  <li key={b.title} className="flex gap-3">
                    <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    <span className="leading-snug">{b.title}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line pt-5 text-sm">
                <p className="font-semibold">Speak to a project manager</p>
                <p className="mt-1 text-ink-soft">
                  <a className="hover:underline" href={`tel:${site.phone}`}>
                    {site.phoneDisplay}
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
