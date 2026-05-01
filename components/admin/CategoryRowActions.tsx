"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteCategoryAction } from "@/app/admin/_actions/categories";
import { PencilIcon, TrashIcon } from "@/components/ui/Icons";

export function CategoryRowActions({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="inline-flex items-center justify-end gap-2">
      <Link
        href={`/admin/categories/${id}`}
        className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink"
      >
        <PencilIcon size={14} /> Edit
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this category? Products will keep their assignment but will not list under it.")) return;
          start(async () => {
            await deleteCategoryAction(id);
            router.refresh();
          });
        }}
        className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-100 disabled:opacity-50"
      >
        <TrashIcon size={14} /> {pending ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
