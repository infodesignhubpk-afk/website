import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/admin/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Design Hub Peshawar",
  description:
    "How Design Hub collects, uses and protects your personal information — including cookies, analytics, advertising partners and your choices.",
  path: "/privacy",
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

export default async function PrivacyPolicyPage() {
  const site = await getSite();

  return (
    <>
      <Section surface="white" className="pt-8 pb-10 md:pt-12 md:pb-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Privacy Policy", href: "/privacy" },
            ]}
          />
          <div className="mt-5 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-ink-soft">
              This policy explains what personal information {site.legalName} collects when you use{" "}
              {site.url.replace(/^https?:\/\//, "")}, why we collect it, who we share it with, and the choices you have.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white" className="pt-0 md:pt-0 lg:pt-0">
        <Container className="max-w-3xl legal-prose">
          <H2>Who we are</H2>
          <P>
            This website is operated by {site.legalName}, a branding, printing, signage and digital marketing studio
            based in {site.address.locality}, {site.address.region}, Pakistan. We are the data controller for the
            information described in this policy.
          </P>
          <UL>
            <li>Address: {site.address.street}, {site.address.locality}, {site.address.region} {site.address.postalCode}</li>
            <li>Email: <a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li>Phone: <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></li>
          </UL>

          <H2>Information you give us</H2>
          <P>
            We only ask for what we need to reply to you or fulfil an order. Depending on which form you use, we collect:
          </P>
          <UL>
            <li>
              <strong>Enquiry and quote forms</strong> — your name, phone number, email address, business name and the
              details of your message or project brief.
            </li>
            <li>
              <strong>Orders placed through our shop</strong> — your name, phone number, email address, business name,
              the items ordered, your chosen delivery method and, where delivery applies, your delivery address,
              postal code and landmark, plus any notes you add to the order.
            </li>
          </UL>
          <P>
            We do not collect or store card numbers or banking credentials on this website. Payments are arranged
            separately by cash on delivery, bank transfer, JazzCash or Easypaisa.
          </P>

          <H2>Information collected automatically</H2>
          <P>
            When you browse the site, our hosting and analytics providers automatically record technical information
            such as your IP address, browser type and version, device type, referring page, the pages you view and the
            date and time of your visit. We use this to keep the site secure and to understand which pages are useful.
          </P>

          <H2>Cookies and similar technologies</H2>
          <P>We use a small number of cookies and similar storage:</P>
          <UL>
            <li>
              <strong>Strictly necessary</strong> — to remember the contents of your shopping cart and to keep the site
              working correctly. These cannot be switched off.
            </li>
            <li>
              <strong>Analytics</strong> — to measure how the site is used, so we can improve it.
            </li>
            <li>
              <strong>Advertising</strong> — where advertising is shown, to serve and measure ads. See the section
              below.
            </li>
          </UL>
          <P>
            You can block or delete cookies through your browser settings. If you block strictly necessary cookies,
            parts of the site — the cart in particular — may stop working.
          </P>

          <H2>Advertising</H2>
          <P>
            We may display advertising on this website, including advertising served by Google. In connection with
            that advertising:
          </P>
          <UL>
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this
              website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your
              visit to this site and/or other sites on the internet.
            </li>
            <li>
              You may opt out of personalised advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              You may opt out of some third-party vendors&apos; use of cookies for personalised advertising at{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                aboutads.info/choices
              </a>{" "}
              or{" "}
              <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
                optout.networkadvertising.org
              </a>
              .
            </li>
          </UL>

          <H2>Analytics</H2>
          <P>
            We use Google Analytics to understand how visitors use the site. Google Analytics sets cookies and
            processes usage data on our behalf. You can prevent Google Analytics from collecting your data by
            installing the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics opt-out browser add-on
            </a>
            .
          </P>

          <H2>Who we share information with</H2>
          <P>
            We do not sell your personal information. We share it only with the service providers we need in order to
            run this website and deliver your work:
          </P>
          <UL>
            <li><strong>Hosting</strong> — our website host, which processes requests and server logs.</li>
            <li><strong>Database and file storage</strong> — Cloudflare, where site content, orders and uploaded images are stored.</li>
            <li><strong>Google</strong> — for analytics, embedded maps on our contact page, and advertising where shown.</li>
            <li><strong>Workflow and notification tools</strong> — enquiry and quote submissions are forwarded to an automation service so our team is alerted to new leads.</li>
            <li><strong>Delivery partners</strong> — where you choose courier or local delivery, we pass the name, phone number and address needed to deliver your order.</li>
            <li><strong>Professional and legal advisers, or authorities</strong> — where we are required to do so by law.</li>
          </UL>

          <H2>International transfers</H2>
          <P>
            Some of the providers above operate servers outside Pakistan. Where your information is transferred
            internationally, it is handled under those providers&apos; own data protection commitments.
          </P>

          <H2>How long we keep information</H2>
          <P>
            Enquiries and quotes are kept for as long as needed to respond and to maintain a record of our dealings
            with you. Order records are kept for our accounting and warranty purposes. Analytics data is retained
            according to our analytics provider&apos;s standard retention period. If you would like your information
            removed sooner, contact us using the details below.
          </P>

          <H2>Your choices</H2>
          <UL>
            <li>Ask us what personal information we hold about you, and request a copy.</li>
            <li>Ask us to correct information that is wrong or out of date.</li>
            <li>Ask us to delete information we no longer need to keep.</li>
            <li>Ask us to stop contacting you for marketing purposes.</li>
            <li>Control cookies through your browser, and advertising through the opt-out links above.</li>
          </UL>
          <P>
            To make any of these requests, email <a href={`mailto:${site.email}`}>{site.email}</a>. We may ask you to
            confirm your identity before we act on a request.
          </P>

          <H2>Children</H2>
          <P>
            This website is intended for businesses and adults. We do not knowingly collect personal information from
            children. If you believe a child has provided us with personal information, contact us and we will delete
            it.
          </P>

          <H2>Security</H2>
          <P>
            We use reputable providers, encrypted connections and access controls to protect the information we hold.
            No website can be completely secure, so we cannot guarantee absolute security, but we take reasonable
            steps to protect your data and to limit who can access it.
          </P>

          <H2>Changes to this policy</H2>
          <P>
            We may update this policy as our services or the law change. The date at the top of this page shows when
            it was last revised. Material changes will be highlighted on this page.
          </P>

          <H2>Contact us</H2>
          <P>
            Questions about this policy or about how we handle your information? Email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>, call{" "}
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>, or write to us at {site.address.street},{" "}
            {site.address.locality}, {site.address.region} {site.address.postalCode}, Pakistan.
          </P>
          <P>
            See also our <Link href="/terms">Terms of Service</Link>.
          </P>
        </Container>
      </Section>

      <JsonLd
        id="privacy-breadcrumb-jsonld"
        data={breadcrumbList([
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy" },
        ])}
      />
    </>
  );
}
