"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/admin/categories";

export type CategoryActionResult = { ok?: boolean; error?: string };

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

export async function saveCategoryAction(prev: CategoryActionResult, formData: FormData): Promise<CategoryActionResult> {
  await requireAdmin();
  const id = s(formData, "id");
  const payload = {
    slug: s(formData, "slug"),
    name: s(formData, "name"),
    description: s(formData, "description"),
    image: s(formData, "image") || undefined,
    order: n(formData, "order", 999),
  };
  if (!payload.name) return { error: "Name is required." };

  try {
    if (id) {
      await updateCategory(id, payload);
    } else {
      await createCategory(payload);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }

  revalidatePath("/products");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteCategory(id);
  revalidatePath("/products");
  revalidatePath("/admin/categories");
}
