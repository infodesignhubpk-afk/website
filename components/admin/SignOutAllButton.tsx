"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOutAllAction } from "@/app/admin/_actions/auth";

export function SignOutAllButton() {
  const [isPending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Sign out of the admin on every device, including this one?")) return;
        start(async () => {
          const result = await signOutAllAction();
          if (result.error) {
            alert(result.error);
            // If the session had already ended, this swaps in the login form.
            router.refresh();
            return;
          }
          router.refresh();
          router.push("/admin");
        });
      }}
      className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink hover:text-ink disabled:opacity-50"
    >
      {isPending ? (
        "Signing out..."
      ) : (
        <>
          Sign out all<span className="hidden sm:inline"> devices</span>
        </>
      )}
    </button>
  );
}
