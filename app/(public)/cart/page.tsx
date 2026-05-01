import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
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
      <PageHero
        title="Your cart"
        description="Review your items and proceed to checkout. We'll confirm details by phone or WhatsApp before fulfilment."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Cart", href: "/cart" },
        ]}
      />

      <Section surface="white" className="pt-0">
        <Container>
          <CartView />
        </Container>
      </Section>
    </>
  );
}
