import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { listClients } from "@/lib/admin/clients";

export async function TrustBar() {
  const clients = await listClients();
  if (clients.length === 0) return null;

  const logos = [...clients, ...clients];

  return (
    <section
      aria-label="Trusted by"
      className="relative overflow-hidden border-y border-line bg-surface py-12 md:py-16"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(80%_60%_at_50%_0%,_rgba(162,212,94,0.12)_0%,_rgba(255,255,255,0)_70%)]"
      />
      <Container>
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Trusted by 200+ businesses
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            From Peshawar startups to nationwide brands.
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-soft md:text-base">
            A small selection of the teams who trust Design Hub for their identity, signage and print.
          </p>
        </div>

        <div
          className="group relative mt-10 overflow-hidden md:mt-14"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
          }}
        >
          <ul
            className="flex w-max items-center gap-3 animate-trustbar-marquee group-hover:[animation-play-state:paused]"
          >
            {logos.map((c, i) => {
              const inner = c.logoUrl ? (
                <div className="relative h-12 w-32 md:h-14 md:w-40">
                  <Image
                    src={c.logoUrl}
                    alt={c.name}
                    fill
                    sizes="160px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="px-2 text-base font-semibold tracking-tight text-ink-soft md:text-lg">
                  {c.name}
                </span>
              );
              return (
                <li
                  key={`${c.id}-${i}`}
                  className="shrink-0 rounded-2xl border border-line bg-bg px-6 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-sm md:px-8 md:py-6"
                >
                  {c.linkUrl ? (
                    <a
                      href={c.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={c.name}
                      className="block opacity-80 transition-opacity hover:opacity-100"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="opacity-80 transition-opacity hover:opacity-100">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
