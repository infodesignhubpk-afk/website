"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/admin/_actions/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [isPending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() =>
        start(async () => {
          await logoutAction();
          router.refresh();
          router.push("/admin");
        })
      }
      className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-ink hover:text-ink"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
