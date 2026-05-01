import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const items = testimonials.slice(0, 3);
  return (
    <Section surface="alt">
      <Container>
        <SectionHeading
          eyebrow="Clients"
          title="What our clients say after we ship."
        />
        <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
          {items.map((t) => (
            <li key={t.name} className="flex flex-col gap-6 rounded-2xl border border-line bg-bg p-6 md:p-8">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
                <path d="M11.5 8C7.36 8 4 11.36 4 15.5V24h8.5v-8.5H8.5c0-1.66 1.34-3 3-3V8Zm14 0c-4.14 0-7.5 3.36-7.5 7.5V24H26.5v-8.5H22c0-1.66 1.34-3 3-3V8Z" fill="#a2d45e" />
              </svg>
              <p className="text-base leading-relaxed text-ink md:text-lg">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto border-t border-line pt-4">
                <p className="font-semibold tracking-tight">{t.name}</p>
                <p className="text-sm text-muted">
                  {t.role ? `${t.role}, ` : ""}{t.business}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
