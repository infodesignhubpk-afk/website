import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CartView } from "@/components/cart/CartView";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your cart | Design Hub",
  description: "Review the products in your cart and proceed to checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Cart", href: "/cart" }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Your cart</h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
              Review your items and proceed to checkout. We&apos;ll confirm details by phone or WhatsApp before fulfilment.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white">
        <Container>
          <CartView />
        </Container>
      </Section>
    </>
  );
}
