import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { whyChooseUs } from "@/data/faqs";

export function WhyChooseUs() {
  return (
    <Section surface="alt">
      <Container>
        <div className="grid items-end gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
              Why Design Hub
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Six reasons businesses keep <span className="bg-brand px-2 -mx-1 inline-block">coming back</span>.
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base leading-relaxed text-ink-soft md:text-lg">
              We are not the cheapest studio in Peshawar. We are the most accountable. Here is what that looks like in practice — across every project we ship.
            </p>
          </div>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((r, i) => {
            const number = String(i + 1).padStart(2, "0");
            return (
              <li
                key={r.title}
                className="group relative flex flex-col gap-4 overflow-hidden bg-bg p-7 transition-colors duration-300 hover:bg-bg md:p-9"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-4 -top-4 select-none text-[7rem] font-bold leading-none tracking-tighter text-ink/[0.04] transition-colors duration-300 group-hover:text-brand/20 md:text-[8rem]"
                >
                  {number}
                </span>

                <div className="relative flex items-center justify-between">
                  <span className="text-sm font-bold tracking-[0.2em] text-ink-soft">
                    {number}
                  </span>
                  <span
                    aria-hidden
                    className="grid h-8 w-8 place-items-center rounded-full border border-ink/15 bg-bg transition-all duration-300 group-hover:border-brand group-hover:bg-brand"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L9.5 6M6.5 3L9.5 6L6.5 9"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-ink-soft transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </svg>
                  </span>
                </div>

                <h3 className="relative text-xl font-bold tracking-tight md:text-2xl">
                  {r.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-ink-soft md:text-[15px]">
                  {r.description}
                </p>

                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100"
                />
              </li>
            );
          })}
        </ul>

        <div className="relative mt-12 overflow-hidden rounded-3xl border border-ink/10 md:mt-16">
          <div className="relative aspect-[16/7] md:aspect-[21/7]">
            <Image
              src="https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777736181337-7z8dyq-offset-printing.jpeg"
              alt="Offset printing press in operation at the Design Hub studio"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/10"
            />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 md:px-12 lg:px-16 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-bg/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                In-house production
              </span>
              <p className="mt-4 text-xl font-bold leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
                Offset, digital and large-format presses — under one roof.
              </p>
              <p className="mt-3 hidden text-sm leading-relaxed text-white/70 md:block md:text-base">
                Fewer vendors in the chain means tighter colour matching, faster reprints and accountable timelines.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
