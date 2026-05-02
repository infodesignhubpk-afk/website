"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createProduct, deleteProduct, updateProduct } from "@/lib/admin/products";
import { sanitizeRichText } from "@/components/ui/RichText";

export type ProductActionResult = { ok?: boolean; error?: string };

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

function jsonArray(fd: FormData, name: string): string[] {
  const v = fd.get(name);
  if (typeof v !== "string" || !v.length) return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function saveProductAction(prev: ProductActionResult, formData: FormData): Promise<ProductActionResult> {
  await requireAdmin();
  const id = s(formData, "id");
  const features = s(formData, "features")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const payload = {
    slug: s(formData, "slug"),
    name: s(formData, "name"),
    shortDescription: s(formData, "shortDescription"),
    description: sanitizeRichText(s(formData, "description")),
    price: n(formData, "price"),
    currency: s(formData, "currency") || "PKR",
    categoryIds: jsonArray(formData, "categoryIds"),
    images: jsonArray(formData, "images"),
    features,
    inStock: bool(formData, "inStock"),
    published: bool(formData, "published"),
    metaTitle: s(formData, "metaTitle") || undefined,
    metaDescription: s(formData, "metaDescription") || undefined,
  };

  if (!payload.name) return { error: "Name is required." };
  if (payload.price < 0) return { error: "Price must be a positive number." };

  try {
    if (id) {
      await updateProduct(id, payload);
    } else {
      await createProduct(payload);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/products");
  revalidatePath("/admin/products");
}
