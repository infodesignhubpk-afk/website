import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyChooseUs } from "@/data/faqs";

export function WhyChooseUs() {
  return (
    <Section surface="alt">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Why Design Hub"
              title="Six reasons businesses keep coming back."
              description="We are not the cheapest studio in Peshawar. We are the most accountable. Here is what that looks like in practice."
            />
            <div className="relative mt-10 hidden aspect-[4/5] max-w-md overflow-hidden rounded-2xl border border-line lg:block">
              <Image
                src="https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777736181337-7z8dyq-offset-printing.jpeg"
                alt="Offset printing press in operation at the Design Hub studio"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent"
              />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-bg/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  In-house production
                </span>
                <p className="mt-3 text-sm font-semibold leading-tight text-white">
                  Offset, digital and large-format under one roof.
                </p>
              </div>
            </div>
          </div>

          <ul className="grid gap-5 lg:col-span-7 md:grid-cols-2">
            {whyChooseUs.map((r, i) => (
              <li key={r.title} className="rounded-2xl border border-line bg-bg p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tracking-widest text-muted">0{i + 1}</span>
                  <span aria-hidden className="h-2 w-2 rounded-full bg-brand" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight md:text-xl">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-[15px]">{r.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-line lg:hidden">
          <Image
            src="https://pub-0e1879e89f994157b46dba1da3153292.r2.dev/uploads/1777736181337-7z8dyq-offset-printing.jpeg"
            alt="Offset printing press in operation at the Design Hub studio"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent"
          />
          <div className="absolute bottom-5 left-5 right-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-bg/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              In-house production
            </span>
            <p className="mt-3 text-sm font-semibold leading-tight text-white">
              Offset, digital and large-format under one roof.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
