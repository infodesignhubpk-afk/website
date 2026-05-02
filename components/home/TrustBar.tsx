import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { listClients } from "@/lib/admin/clients";

export async function TrustBar() {
  const clients = await listClients();
  if (clients.length === 0) return null;
  return (
    <section className="border-y border-line bg-surface py-10" aria-label="Trusted by">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Trusted by businesses across Peshawar
        </p>
        <ul className="mt-6 grid grid-cols-2 items-center gap-x-6 gap-y-4 sm:grid-cols-4 lg:grid-cols-8">
          {clients.map((c) => {
            const inner = c.logoUrl ? (
              <div className="relative h-10 w-full">
                <Image
                  src={c.logoUrl}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <span className="text-sm font-semibold tracking-tight text-ink-soft md:text-base">
                {c.name}
              </span>
            );
            return (
              <li key={c.id} className="flex items-center justify-center">
                {c.linkUrl ? (
                  <a
                    href={c.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={c.name}
                    className="block w-full opacity-80 transition-opacity hover:opacity-100"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="w-full">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
