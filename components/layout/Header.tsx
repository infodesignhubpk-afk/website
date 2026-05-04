import Link from "next/link";
import { navLinks } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { getSite } from "@/lib/admin/site";
import { CartIcon } from "@/components/cart/CartIcon";
import { MobileMenu } from "@/components/layout/MobileMenu";

export async function Header() {
  const site = await getSite();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <Container className="flex h-20 items-center justify-between md:h-24">
        <Logo name={site.name} logoUrl={site.logoUrl} variant="ink" />

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navLinks.slice(1, -1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <CartIcon />
          <MobileMenu
            links={navLinks}
            phone={site.phone}
            phoneDisplay={site.phoneDisplay}
            whatsappNumber={site.whatsappNumber}
            siteName={site.name}
          />
        </div>
      </Container>
    </header>
  );
}
