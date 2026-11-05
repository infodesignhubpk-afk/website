"use client";

import { useRef, useState } from "react";
import { AdminButton, Field, TextArea, TextInput } from "@/components/admin/AdminUI";
import { PlusIcon, TrashIcon } from "@/components/ui/Icons";

type Row = { key: number; first: string; second: string };

type Props = {
  rows: [string, string][];
  firstName: string;
  secondName: string;
  firstLabel: string;
  secondLabel: string;
  firstPlaceholder?: string;
  secondPlaceholder?: string;
  addLabel: string;
};

// Repeating title/description rows. Inputs share a name per column so the
// server action reads them back in order with FormData.getAll().
export function PairRowsEditor({
  rows: initial,
  firstName,
  secondName,
  firstLabel,
  secondLabel,
  firstPlaceholder,
  secondPlaceholder,
  addLabel,
}: Props) {
  const nextKey = useRef(Math.max(initial.length, 1));
  const [rows, setRows] = useState<Row[]>(() =>
    (initial.length ? initial : [["", ""] as [string, string]]).map(([first, second], key) => ({ key, first, second })),
  );

  return (
    <div className="grid gap-4">
      {rows.map((row, i) => (
        <div key={row.key} className="rounded-xl border border-line p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">#{i + 1}</p>
            <button
              type="button"
              onClick={() => setRows((r) => r.filter((x) => x.key !== row.key))}
              className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800 hover:bg-red-100"
              aria-label={`Remove ${firstLabel.toLowerCase()} ${i + 1}`}
            >
              <TrashIcon size={12} /> Remove
            </button>
          </div>
          <div className="mt-3 grid gap-3">
            <Field label={firstLabel} htmlFor={`${firstName}-${row.key}`}>
              <TextInput
                id={`${firstName}-${row.key}`}
                name={firstName}
                defaultValue={row.first}
                placeholder={firstPlaceholder}
              />
            </Field>
            <Field label={secondLabel} htmlFor={`${secondName}-${row.key}`}>
              <TextArea
                id={`${secondName}-${row.key}`}
                name={secondName}
                defaultValue={row.second}
                placeholder={secondPlaceholder}
                rows={3}
              />
            </Field>
          </div>
        </div>
      ))}
      <div>
        <AdminButton
          type="button"
          variant="ghost"
          onClick={() => setRows((r) => [...r, { key: nextKey.current++, first: "", second: "" }])}
        >
          <PlusIcon size={14} /> {addLabel}
        </AdminButton>
      </div>
    </div>
  );
}
