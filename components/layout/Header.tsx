import Link from "next/link";
import { navLinks } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { PhoneIcon } from "@/components/ui/Icons";
import { getSite } from "@/lib/admin/site";
import { CartIcon } from "@/components/cart/CartIcon";

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
          <a
            href={`tel:${site.phone}`}
            aria-label={`Call ${site.phoneDisplay}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink hover:border-ink md:hidden"
          >
            <PhoneIcon size={18} />
          </a>
          <CartIcon />
          <Button href="/get-quote" size="md" className="hidden md:inline-flex">
            Get a Quote
          </Button>
          <Button href="/contact" variant="ink" size="md" className="md:hidden">
            Contact
          </Button>
        </div>
      </Container>
    </header>
  );
}
