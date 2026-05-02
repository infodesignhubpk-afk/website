import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { services } from "@/data/services";
import { getSite } from "@/lib/admin/site";

export async function Footer() {
  const site = await getSite();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-ink text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-4 md:py-20">
        <div className="md:col-span-1">
          <Logo name={site.name} logoUrl={site.logoWhiteUrl || site.logoUrl} variant="brand" />
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {site.shortDescription}
          </p>
          <div className="mt-6 space-y-2 text-sm text-white/80">
            <p>{site.address.street}</p>
            <p>
              {site.address.locality}, {site.address.region}
            </p>
            <p>
              <a href={`tel:${site.phone}`} className="hover:text-brand">
                {site.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-brand">
                {site.email}
              </a>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Services</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-white/80 hover:text-brand">
                  {s.keyword}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="text-white/80 hover:text-brand">About</Link></li>
            <li><Link href="/portfolio" className="text-white/80 hover:text-brand">Portfolio</Link></li>
            <li><Link href="/case-studies" className="text-white/80 hover:text-brand">Case Studies</Link></li>
            <li><Link href="/products" className="text-white/80 hover:text-brand">Shop</Link></li>
            <li><Link href="/blog" className="text-white/80 hover:text-brand">Blog</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-brand">Contact</Link></li>
            <li><Link href="/get-quote" className="text-white/80 hover:text-brand">Get a Quote</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Hours</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {site.openingHours.map((h) => (
              <li key={h.days}>
                <span className="text-white">{h.days}</span> · {h.hours}
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-brand">Follow</h3>
          <div className="mt-4">
            <SocialLinks social={site.social} />
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-start justify-between gap-3 py-6 text-xs text-white/60 md:flex-row md:items-center">
          <p>© {year} {site.legalName}. All rights reserved.</p>
          <p>Branding · Printing · Signage · Digital · Peshawar</p>
          <p>
            Developed by{" "}
            <a
              href="https://webspires.com.pk?utm=designhub"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 hover:text-brand"
            >
              Webspires
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
