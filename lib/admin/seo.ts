import "server-only";
import { d1All, d1Exec, d1Configured, nowMs } from "@/lib/db";
import type { SeoSettings } from "@/types/admin";

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
  if (!d1Configured) return seed;
  try {
    const rows = await d1All<{ data: string }>(
      "SELECT data FROM seo_settings WHERE id = 1",
    );
    if (!rows.length) return seed;
    const stored = JSON.parse(rows[0].data) as Partial<SeoSettings>;
    return { ...seed, ...stored };
  } catch (err) {
    console.warn("[seo] D1 read failed, using seed defaults:", err);
    return seed;
  }
}

export async function saveSeoSettings(value: SeoSettings): Promise<void> {
  await d1Exec(
    `INSERT INTO seo_settings (id, data, updated_at) VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    [JSON.stringify(value), nowMs()],
  );
}
