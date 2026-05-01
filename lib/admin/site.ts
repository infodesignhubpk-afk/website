import "server-only";
import { cache } from "react";
import { readJson, writeJson } from "@/lib/store";
import { siteConfig } from "@/data/site";
import type { SiteSettings } from "@/types/admin";
import type { SiteConfig } from "@/types";

const FILE = "site.json";

const seed: SiteSettings = {
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  shortDescription: siteConfig.shortDescription,
  url: siteConfig.url,
  phone: siteConfig.phone,
  phoneDisplay: siteConfig.phoneDisplay,
  whatsappNumber: siteConfig.whatsappNumber,
  email: siteConfig.email,
  street: siteConfig.address.street,
  locality: siteConfig.address.locality,
  region: siteConfig.address.region,
  postalCode: siteConfig.address.postalCode,
  country: siteConfig.address.country,
  latitude: siteConfig.geo.latitude,
  longitude: siteConfig.geo.longitude,
  facebook: siteConfig.social.facebook ?? "",
  instagram: siteConfig.social.instagram ?? "",
  linkedin: siteConfig.social.linkedin ?? "",
  youtube: siteConfig.social.youtube ?? "",
  tiktok: "",
  whatsappChannel: "",
  logoUrl: "",
  logoWhiteUrl: "",
  faviconUrl: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const stored = await readJson<Partial<SiteSettings>>(FILE, {});
  return { ...seed, ...stored };
}

export async function saveSiteSettings(value: SiteSettings): Promise<void> {
  await writeJson(FILE, value);
}

export const getSite = cache(async (): Promise<SiteConfig & {
  logoUrl: string;
  logoWhiteUrl: string;
  faviconUrl: string;
  social: SiteConfig["social"] & { tiktok?: string; whatsappChannel?: string };
}> => {
  const s = await getSiteSettings();
  return {
    name: s.name,
    legalName: s.legalName,
    shortDescription: s.shortDescription,
    url: s.url,
    phone: s.phone,
    phoneDisplay: s.phoneDisplay,
    whatsappNumber: s.whatsappNumber,
    email: s.email,
    address: {
      street: s.street,
      locality: s.locality,
      region: s.region,
      postalCode: s.postalCode,
      country: s.country,
    },
    geo: { latitude: s.latitude, longitude: s.longitude },
    openingHours: siteConfig.openingHours,
    social: {
      facebook: s.facebook || undefined,
      instagram: s.instagram || undefined,
      linkedin: s.linkedin || undefined,
      youtube: s.youtube || undefined,
      tiktok: s.tiktok || undefined,
      whatsappChannel: s.whatsappChannel || undefined,
    },
    founded: siteConfig.founded,
    logoUrl: s.logoUrl,
    logoWhiteUrl: s.logoWhiteUrl,
    faviconUrl: s.faviconUrl,
  };
});
