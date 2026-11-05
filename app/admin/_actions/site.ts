"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { saveSiteSettings, getSiteSettings } from "@/lib/admin/site";
import { saveSeoSettings, getSeoSettings } from "@/lib/admin/seo";
import { GA_MEASUREMENT_ID } from "@/lib/validation";
import type { SiteSettings } from "@/types/admin";

export type ActionResult = {
  ok?: boolean;
  error?: string;
  /** On a rejected save, the text fields as submitted, so the form can show them again. */
  values?: Record<string, string>;
};

function s(formData: FormData, name: string, fallback = ""): string {
  const v = formData.get(name);
  return typeof v === "string" ? v : fallback;
}

// React resets a form after every action, so without these a rejected save
// would put every field back to its old saved value and lose the edits.
function submitted(formData: FormData, names: readonly string[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const name of names) {
    const v = formData.get(name);
    if (typeof v === "string") values[name] = v;
  }
  return values;
}

function n(formData: FormData, name: string, fallback = 0): number {
  const v = formData.get(name);
  if (typeof v !== "string" || !v.length) return fallback;
  const num = Number(v);
  return Number.isFinite(num) ? num : fallback;
}

// Absolute http(s) only: these values become hrefs and image sources on every
// public page, so a "javascript:" or "data:" value must never be stored.
function isHttpUrl(value: string): boolean {
  if (/\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

// Images may also be files on this site, such as the default "/og-default.png".
function isImageUrl(value: string): boolean {
  return isHttpUrl(value) || /^\/(?![/\\])[^\s\\]*$/.test(value);
}

// Shown as links in the footer and JSON-LD. The site URL is required.
const LINK_FIELDS = [
  ["url", "Public site URL"],
  ["facebook", "Facebook URL"],
  ["instagram", "Instagram URL"],
  ["linkedin", "LinkedIn URL"],
  ["youtube", "YouTube URL"],
  ["tiktok", "TikTok URL"],
  ["whatsappChannel", "WhatsApp Channel URL"],
] as const;

const IMAGE_FIELDS = [
  ["logoUrl", "Logo (light backgrounds)"],
  ["logoWhiteUrl", "Logo (dark backgrounds)"],
  ["faviconUrl", "Favicon"],
] as const;

// The form's text fields; the image fields are kept in the form's own state.
const SITE_TEXT_FIELDS = [
  "name",
  "legalName",
  "shortDescription",
  "url",
  "phone",
  "phoneDisplay",
  "whatsappNumber",
  "email",
  "street",
  "locality",
  "region",
  "postalCode",
  "country",
  "latitude",
  "longitude",
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "whatsappChannel",
] as const;

const SEO_TEXT_FIELDS = ["defaultTitle", "defaultDescription", "keywords", "gscVerification", "gaId", "twitterHandle"] as const;

function invalidUrlFields(settings: SiteSettings): string[] {
  const invalid: string[] = [];
  for (const [key, label] of LINK_FIELDS) {
    const value = settings[key];
    if ((value || key === "url") && !isHttpUrl(value)) invalid.push(label);
  }
  for (const [key, label] of IMAGE_FIELDS) {
    const value = settings[key];
    if (value && !isImageUrl(value)) invalid.push(label);
  }
  return invalid;
}

function invalidUrlError(labels: string[]): string {
  return `Check ${labels.join(", ")}: enter a full web address starting with https://.`;
}

export async function saveSiteAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    const current = await getSiteSettings();
    const next: SiteSettings = {
      ...current,
      name: s(formData, "name", current.name),
      legalName: s(formData, "legalName", current.legalName),
      shortDescription: s(formData, "shortDescription", current.shortDescription),
      url: s(formData, "url", current.url).trim(),
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
      facebook: s(formData, "facebook").trim(),
      instagram: s(formData, "instagram").trim(),
      linkedin: s(formData, "linkedin").trim(),
      youtube: s(formData, "youtube").trim(),
      tiktok: s(formData, "tiktok").trim(),
      whatsappChannel: s(formData, "whatsappChannel").trim(),
      logoUrl: s(formData, "logoUrl").trim(),
      logoWhiteUrl: s(formData, "logoWhiteUrl").trim(),
      faviconUrl: s(formData, "faviconUrl").trim(),
    };
    const invalid = invalidUrlFields(next);
    if (invalid.length) return { error: invalidUrlError(invalid), values: submitted(formData, SITE_TEXT_FIELDS) };
    await saveSiteSettings(next);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed", values: submitted(formData, SITE_TEXT_FIELDS) };
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
    const defaultOgImage = s(formData, "defaultOgImage", current.defaultOgImage).trim();
    if (defaultOgImage && !isImageUrl(defaultOgImage)) {
      return { error: invalidUrlError(["Default Open Graph image"]), values: submitted(formData, SEO_TEXT_FIELDS) };
    }
    // The ID is written into an inline script on every page, so only the
    // exact GA4 format is accepted.
    const gaId = s(formData, "gaId").trim().toUpperCase();
    if (gaId && !GA_MEASUREMENT_ID.test(gaId)) {
      return {
        error: "Google Analytics 4 ID must look like G-XXXXXXXXXX (letters and numbers only).",
        values: submitted(formData, SEO_TEXT_FIELDS),
      };
    }
    await saveSeoSettings({
      ...current,
      defaultTitle: s(formData, "defaultTitle", current.defaultTitle),
      defaultDescription: s(formData, "defaultDescription", current.defaultDescription),
      defaultOgImage,
      gscVerification: s(formData, "gscVerification"),
      gaId,
      twitterHandle: s(formData, "twitterHandle"),
      keywords: keywords.length ? keywords : current.keywords,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed", values: submitted(formData, SEO_TEXT_FIELDS) };
  }
}
