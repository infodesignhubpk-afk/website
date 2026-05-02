import type { Metadata } from "next";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { Jost, Montserrat } from "next/font/google";
import "./globals.css";
import { getSite } from "@/lib/admin/site";
import { getSeoSettings } from "@/lib/admin/seo";
import { siteConfig } from "@/data/site";

const display = Jost({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const site = await getSite();
  const verification = seo.gscVerification || process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined;
  return {
    metadataBase: new URL(site.url || siteConfig.url),
    title: { default: seo.defaultTitle, template: `%s | ${site.name}` },
    description: seo.defaultDescription,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    keywords: seo.keywords,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_PK",
      siteName: site.name,
      images: [seo.defaultOgImage || "/og-default.png"],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    icons: site.faviconUrl
      ? { icon: [{ url: site.faviconUrl }] }
      : undefined,
    other: verification ? { "google-site-verification": verification } : undefined,
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const seo = await getSeoSettings();
  const gaId = seo.gaId || process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-ink antialiased" suppressHydrationWarning>
        <NextTopLoader
          color="#f5a732"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #f5a732,0 0 5px #f5a732"
          easing="ease"
          speed={300}
        />
        {children}

        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
