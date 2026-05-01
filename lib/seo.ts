import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/utils";

type SeoArgs = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

const DEFAULT_OG = "/og-default.png";

export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG,
  noIndex = false,
}: SeoArgs): Metadata {
  const url = absoluteUrl(siteConfig.url, path);
  const ogImage = absoluteUrl(siteConfig.url, image);

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_PK",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
    other: process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { "google-site-verification": process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : undefined,
  };
}
