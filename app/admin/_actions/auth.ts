"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { login, logout } from "@/lib/auth";

export type AuthResult = { error?: string; ok?: boolean };

export async function loginAction(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const passcode = String(formData.get("passcode") ?? "");
  const ok = await login(passcode);
  if (!ok) return { error: "Incorrect passcode." };
  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  revalidatePath("/admin");
}
