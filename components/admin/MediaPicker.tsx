"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CopyIcon, ExternalIcon, TrashIcon, UploadIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label: string;
  folder?: string;
  hint?: string;
  recommended?: string;
};

export function MediaPicker({ value, onChange, label, folder = "general", hint, recommended }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Upload failed (${res.status})`);
      }
      const data = (await res.json()) as { url: string };
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
      <div className="mt-2 flex flex-col gap-3 rounded-xl border border-line bg-bg p-3 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface">
          {value ? (
            <Image src={value} alt={label} width={80} height={80} className="h-full w-full object-cover" unoptimized />
          ) : (
            <span className="text-xs text-muted">No image</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… or upload"
            className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink",
                busy && "opacity-50",
              )}
            >
              <UploadIcon size={14} /> {busy ? "Uploading..." : "Upload"}
            </button>
            {value ? (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(value);
                      setCopied(true);
                    } catch {}
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink"
                >
                  <CopyIcon size={14} /> {copied ? "Copied" : "Copy URL"}
                </button>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink"
                >
                  <ExternalIcon size={14} /> Open
                </a>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-100"
                >
                  <TrashIcon size={14} /> Clear
                </button>
              </>
            ) : null}
          </div>
          {recommended ? <p className="text-xs text-muted">Recommended: {recommended}</p> : null}
          {hint ? <p className="text-xs text-muted">{hint}</p> : null}
          {error ? <p className="text-xs font-medium text-red-700">{error}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.currentTarget.value = "";
        }}
      />
    </div>
  );
}
