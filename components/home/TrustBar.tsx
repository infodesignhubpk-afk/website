import { Container } from "@/components/ui/Container";

const clients = [
  "Khyber Realty",
  "Saddar Bites",
  "Frontier Clinic",
  "Ring Road Motors",
  "North Academy",
  "Amna Couture",
  "KP Logistics",
  "Peshawar Pharma",
];

export function TrustBar() {
  return (
    <section className="border-y border-line bg-surface py-10" aria-label="Trusted by">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Trusted by businesses across Peshawar
        </p>
        <div className="mt-6 grid grid-cols-2 items-center gap-x-6 gap-y-4 sm:grid-cols-4 lg:grid-cols-8">
          {clients.map((c) => (
            <div
              key={c}
              className="flex items-center justify-center text-center text-sm font-semibold tracking-tight text-ink-soft md:text-base"
            >
              {c}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
