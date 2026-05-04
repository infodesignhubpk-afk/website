import Image from "next/image";
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
            <div className="mt-8 flex items-center gap-2 sm:gap-3">
              <Button
                href="/get-quote"
                size="lg"
                className="flex-1 sm:flex-none max-sm:px-4 max-sm:py-2.5 max-sm:text-sm"
              >
                Get a Quote
                <ArrowRightIcon size={16} />
              </Button>
              <Button
                href={whatsappLink(site.whatsappNumber, `Hi ${site.name}, I'd like to discuss a project.`)}
                variant="secondary"
                size="lg"
                className="flex-1 sm:flex-none max-sm:px-4 max-sm:py-2.5 max-sm:text-sm"
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

type HeroTile = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  offset: string;
  toneClass: string;
};

const heroTiles: HeroTile[] = [
  {
    src: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777736164292-drbj4n-brand-identity.jpeg",
    alt: "Brand identity work in progress",
    label: "Identity",
    caption: "Logo design + brand systems",
    offset: "",
    toneClass: "text-brand",
  },
  {
    src: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777736182563-kh2yzg-printed-materials.jpeg",
    alt: "Stack of printed materials and stationery",
    label: "Print",
    caption: "600+ print runs delivered",
    offset: "mt-8",
    toneClass: "text-brand",
  },
  {
    src: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777736173183-ki1xef-flex-banner-branding.jpeg",
    alt: "Outdoor flex banner signboard installation",
    label: "Signboards",
    caption: "Flex banners · Boards · Outdoor",
    offset: "-mt-8",
    toneClass: "text-brand",
  },
  {
    src: "https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777729739972-9jxscw-portrait-vector.jpeg",
    alt: "Vector illustration portrait used in social campaigns",
    label: "Digital",
    caption: "Meta Ads · Lead-gen for KP",
    offset: "",
    toneClass: "text-brand",
  },
];

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {heroTiles.map((tile) => (
          <div
            key={tile.label}
            className={`relative aspect-[4/5] overflow-hidden rounded-2xl border border-line ${tile.offset}`}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              priority
              sizes="(max-width: 1024px) 50vw, 240px"
              className="object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent"
            />
            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1 text-white">
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${tile.toneClass}`}>
                {tile.label}
              </span>
              <p className="text-sm font-semibold leading-tight">{tile.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
