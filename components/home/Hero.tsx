import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { trustStats } from "@/data/site";
import { whatsappLink } from "@/lib/utils";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getSite } from "@/lib/admin/site";

export async function Hero() {
  const site = await getSite();
  return (
    <section className="relative overflow-hidden bg-bg pt-12 pb-16 md:pt-20 md:pb-28 lg:pt-28 lg:pb-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[60%] bg-[radial-gradient(80%_60%_at_70%_0%,_rgba(162,212,94,0.25)_0%,_rgba(255,255,255,0)_70%)]"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 -z-10 h-96 w-96 rounded-full bg-brand/30 blur-3xl"
      />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Peshawar&apos;s branding & print studio
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Branding, Printing & Signage Agency in <span className="bg-brand px-2 -mx-1 inline-block">Peshawar</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-xl leading-relaxed text-ink-soft">
              Logos, identity systems, brochures, hoardings, 3D signage, vehicle wraps and Meta ads — all from one studio. Designed locally, built to last, delivered on time.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/get-quote" size="lg">
                Get a Free Quote
                <ArrowRightIcon size={16} />
              </Button>
              <Button
                href={whatsappLink(site.whatsappNumber, `Hi ${site.name}, I'd like to discuss a project.`)}
                variant="secondary"
                size="lg"
              >
                <WhatsAppIcon size={16} />
                WhatsApp Us
              </Button>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8 max-w-xl">
              {trustStats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-muted">{s.label}</dt>
                  <dd className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="aspect-[4/5] rounded-2xl bg-ink p-6 text-white flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">Identity</span>
          <div>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-brand text-ink font-bold text-2xl">DH</div>
            <p className="mt-3 text-sm leading-tight text-white/70">Logo design + brand systems</p>
          </div>
        </div>
        <div className="aspect-[4/5] rounded-2xl bg-brand p-6 text-ink flex flex-col justify-between mt-8">
          <span className="text-xs font-semibold uppercase tracking-wider">Print</span>
          <div>
            <div className="text-3xl font-bold leading-none">600+</div>
            <p className="mt-1 text-sm leading-tight">Print runs delivered</p>
          </div>
        </div>
        <div className="aspect-[4/5] rounded-2xl bg-cta p-6 text-ink flex flex-col justify-between -mt-8">
          <span className="text-xs font-semibold uppercase tracking-wider">Signage</span>
          <div>
            <div className="text-3xl font-bold leading-none">3D</div>
            <p className="mt-1 text-sm leading-tight">Letters · Acrylic · Lightboxes</p>
          </div>
        </div>
        <div className="aspect-[4/5] rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Digital</span>
          <div>
            <div className="text-3xl font-bold leading-none">Meta Ads</div>
            <p className="mt-1 text-sm leading-tight text-ink-soft">Lead-gen for KP businesses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
