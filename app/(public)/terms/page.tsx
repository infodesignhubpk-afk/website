import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/admin/site";
import { DELIVERY_FEES, DELIVERY_LABELS, PAYMENT_LABELS } from "@/lib/orderValidation";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | Design Hub Peshawar",
  description:
    "The terms that apply when you use the Design Hub website, request a quote, or place an order for branding, printing, signage or digital marketing work.",
  path: "/terms",
});

const LAST_UPDATED = "24 August 2026";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 text-2xl md:text-3xl font-bold tracking-tight">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-base md:text-lg leading-relaxed text-ink-soft">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-base md:text-lg leading-relaxed text-ink-soft">
      {children}
    </ul>
  );
}

const deliveryOptions = (["pickup", "peshawar", "courier"] as const).map((key) => ({
  label: DELIVERY_LABELS[key],
  fee: DELIVERY_FEES[key],
}));

const paymentOptions = (["cod", "bank_transfer", "jazzcash", "easypaisa"] as const).map(
  (key) => PAYMENT_LABELS[key],
);

export default async function TermsPage() {
  const site = await getSite();

  return (
    <>
      <Section surface="white" className="pt-8 pb-10 md:pt-12 md:pb-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Terms of Service", href: "/terms" },
            ]}
          />
          <div className="mt-5 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Terms of Service</h1>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-ink-soft">
              These terms apply when you use this website, request a quote, or place an order with {site.legalName}.
              Please read them before ordering.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white" className="pt-0 md:pt-0 lg:pt-0">
        <Container className="max-w-3xl">
          <div className="legal-prose">
            <H2>Who we are</H2>
            <P>
              This website is operated by {site.legalName} of {site.address.street}, {site.address.locality},{" "}
              {site.address.region} {site.address.postalCode}, Pakistan. In these terms, &ldquo;we&rdquo;,
              &ldquo;us&rdquo; and &ldquo;our&rdquo; mean {site.legalName}, and &ldquo;you&rdquo; means the person or
              business using the site or placing an order.
            </P>

            <H2>Using this website</H2>
            <P>
              You may browse the site and use it to contact us or place an order. You agree not to misuse it — for
              example by attempting to gain unauthorised access, interfering with its operation, scraping it at scale,
              or submitting false information through our forms.
            </P>

            <H2>Quotes and project work</H2>
            <P>
              Prices shown on the site are a guide. Design, branding, signage and large-format projects are quoted
              individually after we understand the scope. A quote is valid for 30 days unless it says otherwise, and
              becomes binding once you confirm it in writing (including by email or WhatsApp) and we acknowledge it.
            </P>
            <P>
              Where a project depends on information, artwork, approvals or site access from you, timelines run from
              the point we receive what we need. Delays in approvals move delivery dates accordingly.
            </P>

            <H2>Artwork, proofs and approvals</H2>
            <P>
              Before anything goes to print or production we will provide a proof. It is your responsibility to check
              spelling, numbers, contact details, dimensions and colours on that proof. Once you approve it, the job
              proceeds on that basis and we are not responsible for errors that were present in the approved proof.
            </P>
            <P>
              If you supply artwork or content, you confirm you have the right to use it and that it does not infringe
              anyone else&apos;s rights. Colour reproduction can vary between screens, substrates and print processes;
              minor variation is normal and is not a defect.
            </P>

            <H2>Products, prices and currency</H2>
            <P>
              Product prices on our shop are shown in Pakistani Rupees. We try to keep prices and stock accurate, but
              if an item is mispriced or unavailable after you order, we will contact you to correct the order or
              cancel it and arrange a refund of anything already paid.
            </P>

            <H2>Placing an order</H2>
            <P>
              Submitting an order through the shop is an offer to buy. A contract is formed when we confirm the order
              with you. We may decline an order — for example if we cannot meet the deadline, the item is out of
              stock, or the details cannot be verified.
            </P>

            <H2>Payment</H2>
            <P>We currently accept:</P>
            <UL>
              {paymentOptions.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </UL>
            <P>
              Payment is not taken on this website. We confirm the total with you and arrange payment separately. For
              custom production work we may ask for an advance before production begins, with the balance due on
              completion or delivery.
            </P>

            <H2>Delivery</H2>
            <P>Delivery options and charges at the time of writing:</P>
            <UL>
              {deliveryOptions.map((o) => (
                <li key={o.label}>
                  {o.label} — {o.fee === 0 ? "no charge" : `PKR ${o.fee.toLocaleString("en-PK")}`}
                </li>
              ))}
            </UL>
            <P>
              Delivery timeframes are estimates. Where a courier is used, responsibility for transit sits with the
              courier once the order has been handed over, though we will help you follow up on any problem.
              Installation of signage is quoted separately and depends on site readiness and any permissions required.
            </P>

            <H2>Cancellations, changes and refunds</H2>
            <P>
              You can change or cancel an order at no cost before production begins. Because most of what we make is
              produced to your specification — printed, cut, branded or installed for you — it cannot be resold, so
              once production has started a cancellation is charged for work already completed and materials already
              committed.
            </P>
            <P>
              If an item arrives damaged, faulty, or materially different from the approved proof, tell us within 7
              days of delivery with photographs and we will reprint, repair or refund it. This does not affect any
              rights you have under Pakistani consumer law.
            </P>

            <H2>Intellectual property</H2>
            <P>
              Everything on this website — text, layout, photography, illustrations and our own branding — belongs to
              us or our licensors and may not be copied or reused without permission.
            </P>
            <P>
              For commissioned design work, ownership of the final approved artwork transfers to you once the project
              has been paid for in full. Working files, source artwork and unused concepts remain ours unless the
              quote says otherwise. Unless you ask us in writing not to, we may show completed work in our portfolio
              and marketing.
            </P>

            <H2>Our responsibility to you</H2>
            <P>
              We will carry out our work with reasonable skill and care. We are not liable for indirect or
              consequential losses — such as lost profit, lost business or missed opportunities — arising from delays,
              production variation or your use of the site. Nothing in these terms limits liability that cannot be
              limited by law.
            </P>

            <H2>Links to other sites</H2>
            <P>
              This site links to and embeds content from other services. We are not responsible for the content or
              practices of those third parties.
            </P>

            <H2>Privacy</H2>
            <P>
              Our <Link href="/privacy">Privacy Policy</Link> explains what personal information we collect and how we
              use it. It forms part of these terms.
            </P>

            <H2>Governing law</H2>
            <P>
              These terms are governed by the laws of the Islamic Republic of Pakistan, and the courts of Peshawar,
              Khyber Pakhtunkhwa have jurisdiction over any dispute. We would always rather resolve a problem by
              talking to you first.
            </P>

            <H2>Changes to these terms</H2>
            <P>
              We may update these terms from time to time. The version published here when you place an order is the
              one that applies to that order.
            </P>

            <H2>Contact us</H2>
            <P>
              Email <a href={`mailto:${site.email}`}>{site.email}</a>, call{" "}
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>, or visit us at {site.address.street},{" "}
              {site.address.locality}, {site.address.region} {site.address.postalCode}, Pakistan.
            </P>
          </div>
        </Container>
      </Section>

      <JsonLd
        id="terms-breadcrumb-jsonld"
        data={breadcrumbList([
          { name: "Home", href: "/" },
          { name: "Terms of Service", href: "/terms" },
        ])}
      />
    </>
  );
}
