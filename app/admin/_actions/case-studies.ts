"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  createCaseStudy,
  deleteCaseStudy,
  updateCaseStudy,
} from "@/lib/admin/case-studies";
import type { ServiceCategory } from "@/types";

export type CaseStudyActionResult = { ok?: boolean; error?: string };

const CATEGORIES: ServiceCategory[] = ["logo", "branding", "signage", "printing", "vehicle", "social"];

function s(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v : "";
}

function b(fd: FormData, name: string): boolean {
  const v = fd.get(name);
  return v === "on" || v === "true";
}

function category(fd: FormData): ServiceCategory {
  const raw = s(fd, "category") as ServiceCategory;
  return CATEGORIES.includes(raw) ? raw : "branding";
}

function metrics(fd: FormData): { label: string; value: string }[] {
  const labels = fd.getAll("metricLabel").map((v) => (typeof v === "string" ? v.trim() : ""));
  const values = fd.getAll("metricValue").map((v) => (typeof v === "string" ? v.trim() : ""));
  return labels
    .map((label, i) => ({ label, value: values[i] ?? "" }))
    .filter((m) => m.label && m.value)
    .slice(0, 6);
}

export async function saveCaseStudyAction(
  prev: CaseStudyActionResult,
  formData: FormData,
): Promise<CaseStudyActionResult> {
  await requireAdmin();
  const id = s(formData, "id");
  const payload = {
    slug: s(formData, "slug"),
    title: s(formData, "title"),
    client: s(formData, "client"),
    industry: s(formData, "industry"),
    category: category(formData),
    summary: s(formData, "summary"),
    challenge: s(formData, "challenge"),
    approach: s(formData, "approach"),
    outcome: s(formData, "outcome"),
    metrics: metrics(formData),
    image: s(formData, "image"),
    metaTitle: s(formData, "metaTitle") || undefined,
    metaDescription: s(formData, "metaDescription") || undefined,
    published: b(formData, "published"),
  };

  if (!payload.title) return { error: "Title is required." };
  if (!payload.client) return { error: "Client is required." };
  if (!payload.summary) return { error: "Summary is required." };
  if (!payload.challenge || !payload.approach || !payload.outcome) {
    return { error: "Challenge, approach and outcome are required." };
  }
  if (payload.metrics.length === 0) return { error: "Add at least one metric." };

  try {
    if (id) {
      await updateCaseStudy(id, payload);
    } else {
      await createCaseStudy(payload);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }

  revalidatePath("/case-studies");
  revalidatePath("/admin/case-studies");
  redirect("/admin/case-studies");
}

export async function deleteCaseStudyAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteCaseStudy(id);
  revalidatePath("/case-studies");
  revalidatePath("/admin/case-studies");
}
