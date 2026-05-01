"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteOrderAction, setOrderStatusAction } from "@/app/admin/_actions/orders";
import { TrashIcon, ExternalIcon } from "@/components/ui/Icons";
import type { OrderStatus } from "@/types/admin";

const statuses: OrderStatus[] = ["new", "in_progress", "fulfilled", "cancelled"];

export function OrderRowActions({ id, status }: { id: string; status: OrderStatus }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="inline-flex items-center justify-end gap-2">
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as OrderStatus;
          start(async () => {
            await setOrderStatusAction(id, next);
            router.refresh();
          });
        }}
        className="rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-semibold focus:border-ink focus:outline-none"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>{s.replace("_", " ")}</option>
        ))}
      </select>
      <Link
        href={`/admin/orders/${id}`}
        className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink"
      >
        <ExternalIcon size={14} /> Open
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this order? This cannot be undone.")) return;
          start(async () => {
            await deleteOrderAction(id);
            router.refresh();
          });
        }}
        className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-100 disabled:opacity-50"
      >
        <TrashIcon size={14} />
      </button>
    </div>
  );
}
