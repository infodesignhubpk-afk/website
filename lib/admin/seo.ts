import "server-only";
import { readJson, writeJson } from "@/lib/store";
import type { SeoSettings } from "@/types/admin";

const FILE = "seo.json";

const seed: SeoSettings = {
  defaultTitle: "Design Hub | Branding, Printing & Signage Agency in Peshawar",
  defaultDescription:
    "Design Hub is Peshawar's branding, printing, signage & digital marketing studio. Logos, identity, brochures, hoardings, 3D signage, vehicle wraps and Meta ads.",
  defaultOgImage: "/og-default.png",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  twitterHandle: "",
  keywords: [
    "branding agency Peshawar",
    "printing services Peshawar",
    "signage company Peshawar",
    "logo design Peshawar",
    "graphic design Peshawar",
  ],
};

export async function getSeoSettings(): Promise<SeoSettings> {
  return readJson<SeoSettings>(FILE, seed);
}

export async function saveSeoSettings(value: SeoSettings): Promise<void> {
  await writeJson(FILE, value);
}
