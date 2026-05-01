import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { services } from "@/data/services";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { getSite } from "@/lib/admin/site";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found. Find your way back from here.",
};

export default async function NotFound() {
  const site = await getSite();
  const popular = services.slice(0, 4);
  return (
    <div className="flex min-h-screen flex-col pb-12 md:pb-0">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-bg pt-16 pb-24 md:pt-24 md:pb-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%] bg-[radial-gradient(70%_55%_at_50%_0%,_rgba(162,212,94,0.25)_0%,_rgba(255,255,255,0)_70%)]"
          />
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" /> 404 · Page not found
              </p>
              <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                We can&apos;t find <span className="bg-brand px-2 -mx-1 inline-block">that page</span>
              </h1>
              <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
                Either the link is wrong, the page has moved, or it never existed. No drama — pick a route below and we&apos;ll get you back on track.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button href="/" size="lg">
                  Back to home
                  <ArrowRightIcon size={16} />
                </Button>
                <Button href="/services" variant="secondary" size="lg">
                  Browse services
                </Button>
                <Button href="/contact" variant="ghost" size="lg">
                  Contact {site.name}
                </Button>
              </div>
            </div>

            <div className="mx-auto mt-20 max-w-4xl">
              <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
                Popular pages
              </p>
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {popular.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-center justify-between rounded-2xl border border-line bg-bg px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-ink"
                    >
                      <span>
                        <span className="block text-base font-semibold tracking-tight">{s.keyword}</span>
                        <span className="mt-0.5 block text-sm text-ink-soft">{s.metaDescription.split(".")[0]}.</span>
                      </span>
                      <ArrowRightIcon size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <WhatsAppButton number={site.whatsappNumber} />
      <StickyMobileCTA phone={site.phone} />
    </div>
  );
}
