import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout | Design Hub",
  description: "Complete your order — choose delivery and payment.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        title="Checkout"
        description="Pick delivery and payment. We'll confirm everything by phone or WhatsApp before fulfilment."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Cart", href: "/cart" },
          { name: "Checkout", href: "/checkout" },
        ]}
      />

      <Section surface="white" className="pt-0">
        <Container>
          <CheckoutForm />
        </Container>
      </Section>
    </>
  );
}
