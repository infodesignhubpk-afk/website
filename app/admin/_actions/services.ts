"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createService, deleteService, updateService } from "@/lib/admin/services";
import type { ServiceCategory } from "@/types";

export type ServiceActionResult = { ok?: boolean; error?: string };

const CATEGORIES: ServiceCategory[] = ["logo", "branding", "signage", "printing", "vehicle", "social"];

function s(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim() : "";
}

function b(fd: FormData, name: string): boolean {
  const v = fd.get(name);
  return v === "on" || v === "true";
}

function category(fd: FormData): ServiceCategory {
  const raw = s(fd, "category") as ServiceCategory;
  return CATEGORIES.includes(raw) ? raw : "branding";
}

// One entry per line.
function lines(fd: FormData, name: string): string[] {
  return s(fd, name)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

// Paragraphs are separated by a blank line.
function paragraphs(fd: FormData, name: string): string[] {
  return s(fd, name)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

function pairs(fd: FormData, first: string, second: string): [string, string][] {
  const a = fd.getAll(first).map((v) => (typeof v === "string" ? v.trim() : ""));
  const z = fd.getAll(second).map((v) => (typeof v === "string" ? v.trim() : ""));
  return a.map((v, i): [string, string] => [v, z[i] ?? ""]).filter(([x, y]) => x && y);
}

function strings(fd: FormData, name: string): string[] {
  return fd.getAll(name).filter((v): v is string => typeof v === "string" && v.length > 0);
}

export async function saveServiceAction(
  prev: ServiceActionResult,
  formData: FormData,
): Promise<ServiceActionResult> {
  await requireAdmin();
  const id = s(formData, "id");
  const order = Number.parseInt(s(formData, "order"), 10);
  const payload = {
    slug: s(formData, "slug"),
    keyword: s(formData, "keyword"),
    h1: s(formData, "h1"),
    category: category(formData),
    metaTitle: s(formData, "metaTitle"),
    metaDescription: s(formData, "metaDescription"),
    hero: {
      subheading: s(formData, "heroSubheading"),
      ctaText: s(formData, "heroCtaText") || "Get a quote",
    },
    overview: paragraphs(formData, "overview"),
    benefits: pairs(formData, "benefitTitle", "benefitDescription").map(([title, description]) => ({ title, description })),
    process: pairs(formData, "processTitle", "processDescription").map(([title, description]) => ({ title, description })),
    useCases: lines(formData, "useCases"),
    industries: lines(formData, "industries"),
    faqs: pairs(formData, "faqQuestion", "faqAnswer").map(([question, answer]) => ({ question, answer })),
    relatedSlugs: strings(formData, "relatedSlugs"),
    order: Number.isFinite(order) ? order : 0,
    published: b(formData, "published"),
  };

  if (!payload.keyword) return { error: "Service name is required." };
  if (!payload.h1) return { error: "Page heading (H1) is required." };
  if (!payload.hero.subheading) return { error: "Hero subheading is required." };
  if (payload.overview.length === 0) return { error: "Add at least one overview paragraph." };
  if (!payload.metaTitle || !payload.metaDescription) {
    return { error: "Meta title and meta description are required." };
  }

  try {
    if (id) {
      await updateService(id, payload);
    } else {
      await createService(payload);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }

  // Services appear in the footer and home grid, so refresh every public page.
  revalidatePath("/", "layout");
  redirect("/admin/services");
}

export async function deleteServiceAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteService(id);
  revalidatePath("/", "layout");
}
