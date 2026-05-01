"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { saveSiteSettings, getSiteSettings } from "@/lib/admin/site";
import { saveSeoSettings, getSeoSettings } from "@/lib/admin/seo";

export type ActionResult = { ok?: boolean; error?: string };

function s(formData: FormData, name: string, fallback = ""): string {
  const v = formData.get(name);
  return typeof v === "string" ? v : fallback;
}

function n(formData: FormData, name: string, fallback = 0): number {
  const v = formData.get(name);
  if (typeof v !== "string" || !v.length) return fallback;
  const num = Number(v);
  return Number.isFinite(num) ? num : fallback;
}

export async function saveSiteAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    const current = await getSiteSettings();
    await saveSiteSettings({
      ...current,
      name: s(formData, "name", current.name),
      legalName: s(formData, "legalName", current.legalName),
      shortDescription: s(formData, "shortDescription", current.shortDescription),
      url: s(formData, "url", current.url),
      phone: s(formData, "phone", current.phone),
      phoneDisplay: s(formData, "phoneDisplay", current.phoneDisplay),
      whatsappNumber: s(formData, "whatsappNumber", current.whatsappNumber),
      email: s(formData, "email", current.email),
      street: s(formData, "street", current.street),
      locality: s(formData, "locality", current.locality),
      region: s(formData, "region", current.region),
      postalCode: s(formData, "postalCode", current.postalCode),
      country: s(formData, "country", current.country),
      latitude: n(formData, "latitude", current.latitude),
      longitude: n(formData, "longitude", current.longitude),
      facebook: s(formData, "facebook"),
      instagram: s(formData, "instagram"),
      linkedin: s(formData, "linkedin"),
      youtube: s(formData, "youtube"),
      tiktok: s(formData, "tiktok"),
      whatsappChannel: s(formData, "whatsappChannel"),
      logoUrl: s(formData, "logoUrl"),
      logoWhiteUrl: s(formData, "logoWhiteUrl"),
      faviconUrl: s(formData, "faviconUrl"),
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function saveSeoAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    const current = await getSeoSettings();
    const keywords = s(formData, "keywords")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    await saveSeoSettings({
      ...current,
      defaultTitle: s(formData, "defaultTitle", current.defaultTitle),
      defaultDescription: s(formData, "defaultDescription", current.defaultDescription),
      defaultOgImage: s(formData, "defaultOgImage", current.defaultOgImage),
      gscVerification: s(formData, "gscVerification"),
      gaId: s(formData, "gaId"),
      twitterHandle: s(formData, "twitterHandle"),
      keywords: keywords.length ? keywords : current.keywords,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }
}
