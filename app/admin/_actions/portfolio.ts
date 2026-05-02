"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  createPortfolioItem,
  deletePortfolioItem,
  updatePortfolioItem,
} from "@/lib/admin/portfolio";
import { sanitizeRichText } from "@/components/ui/RichText";
import type { ServiceCategory } from "@/types";

export type PortfolioActionResult = { ok?: boolean; error?: string };

function s(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v : "";
}

function n(fd: FormData, name: string, fallback = 0): number {
  const v = fd.get(name);
  if (typeof v !== "string") return fallback;
  const num = Number(v);
  return Number.isFinite(num) ? num : fallback;
}

function bool(fd: FormData, name: string): boolean {
  const v = fd.get(name);
  return v === "on" || v === "true";
}

const VALID_CATEGORIES: ServiceCategory[] = [
  "logo",
  "branding",
  "printing",
  "signage",
  "vehicle",
  "social",
];

function category(fd: FormData): ServiceCategory {
  const raw = s(fd, "category");
  return VALID_CATEGORIES.includes(raw as ServiceCategory)
    ? (raw as ServiceCategory)
    : "branding";
}

export async function savePortfolioItemAction(
  prev: PortfolioActionResult,
  formData: FormData,
): Promise<PortfolioActionResult> {
  await requireAdmin();
  const id = s(formData, "id");
  const payload = {
    slug: s(formData, "slug"),
    title: s(formData, "title"),
    category: category(formData),
    client: s(formData, "client"),
    image: s(formData, "image"),
    summary: s(formData, "summary"),
    description: sanitizeRichText(s(formData, "description")) || undefined,
    year: n(formData, "year", new Date().getFullYear()),
    published: bool(formData, "published"),
  };

  if (!payload.title) return { error: "Title is required." };
  if (!payload.client) return { error: "Client is required." };

  try {
    if (id) {
      await updatePortfolioItem(id, payload);
    } else {
      await createPortfolioItem(payload);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }

  revalidatePath("/portfolio");
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolioItemAction(id: string): Promise<void> {
  await requireAdmin();
  await deletePortfolioItem(id);
  revalidatePath("/portfolio");
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
}
