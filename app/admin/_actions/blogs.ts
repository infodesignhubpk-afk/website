"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  updateBlogPost,
} from "@/lib/admin/blogs";

export type BlogActionResult = { ok?: boolean; error?: string };

function s(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v : "";
}

function b(fd: FormData, name: string): boolean {
  const v = fd.get(name);
  return v === "on" || v === "true";
}

function n(fd: FormData, name: string, fallback = 0): number {
  const v = fd.get(name);
  if (typeof v !== "string") return fallback;
  const num = Number(v);
  return Number.isFinite(num) ? num : fallback;
}

function bodyParagraphs(input: string): string[] {
  return input
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export async function saveBlogPostAction(prev: BlogActionResult, formData: FormData): Promise<BlogActionResult> {
  await requireAdmin();
  const id = s(formData, "id");
  const payload = {
    slug: s(formData, "slug"),
    title: s(formData, "title"),
    excerpt: s(formData, "excerpt"),
    date: s(formData, "date") || new Date().toISOString().slice(0, 10),
    author: s(formData, "author") || "Design Hub Studio",
    readingMinutes: n(formData, "readingMinutes", 5),
    body: bodyParagraphs(s(formData, "body")),
    image: s(formData, "image") || undefined,
    metaTitle: s(formData, "metaTitle") || undefined,
    metaDescription: s(formData, "metaDescription") || undefined,
    published: b(formData, "published"),
  };

  if (!payload.title) return { error: "Title is required." };
  if (payload.body.length === 0) return { error: "Body is required." };

  try {
    if (id) {
      await updateBlogPost(id, payload);
    } else {
      await createBlogPost(payload);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function deleteBlogPostAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteBlogPost(id);
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
}

export async function fetchBlogPost(id: string) {
  await requireAdmin();
  return getBlogPostById(id);
}
