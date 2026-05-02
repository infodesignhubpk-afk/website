"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient, deleteClient, updateClient } from "@/lib/admin/clients";

export type ClientActionResult = { ok?: boolean; error?: string };

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

export async function saveClientAction(
  prev: ClientActionResult,
  formData: FormData,
): Promise<ClientActionResult> {
  await requireAdmin();
  const id = s(formData, "id");
  const payload = {
    name: s(formData, "name"),
    logoUrl: s(formData, "logoUrl"),
    linkUrl: s(formData, "linkUrl") || undefined,
    order: n(formData, "order", 999),
  };
  if (!payload.name) return { error: "Name is required." };

  try {
    if (id) {
      await updateClient(id, payload);
    } else {
      await createClient(payload);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

export async function deleteClientAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteClient(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/clients");
}
