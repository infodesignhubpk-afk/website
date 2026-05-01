import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
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
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Cart", href: "/cart" },
              { name: "Checkout", href: "/checkout" },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Checkout</h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
              Pick delivery and payment. We&apos;ll confirm everything by phone or WhatsApp before fulfilment.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white">
        <Container>
          <CheckoutForm />
        </Container>
      </Section>
    </>
  );
}
