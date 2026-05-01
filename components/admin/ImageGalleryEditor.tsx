"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CopyIcon, TrashIcon, UploadIcon } from "@/components/ui/Icons";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  folder?: string;
};

export function ImageGalleryEditor({ value, onChange, folder = "products" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  async function uploadFiles(files: File[]) {
    setBusy(true);
    setError(null);
    const next = [...value];
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || `Upload failed (${res.status})`);
        }
        const data = (await res.json()) as { url: string };
        next.push(data.url);
      }
      onChange(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function remove(idx: number) {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...value];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    const tmp = next[idx];
    next[idx] = next[t];
    next[t] = tmp;
    onChange(next);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">Images</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink disabled:opacity-50"
        >
          <UploadIcon size={14} /> {busy ? "Uploading..." : "Add images"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) void uploadFiles(files);
          e.currentTarget.value = "";
        }}
      />

      {error ? <p className="mt-2 text-xs font-medium text-red-700">{error}</p> : null}

      {value.length === 0 ? (
        <div className="mt-3 grid place-items-center rounded-2xl border border-dashed border-line bg-surface p-8 text-sm text-muted">
          No images yet. Click &ldquo;Add images&rdquo; to upload to Cloudflare R2.
        </div>
      ) : (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((url, i) => (
            <li key={url} className="overflow-hidden rounded-2xl border border-line bg-bg">
              <div className="relative aspect-[4/3] bg-surface">
                <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" unoptimized />
                {i === 0 ? (
                  <span className="absolute left-3 top-3 rounded-full bg-brand px-2 py-0.5 text-xs font-bold uppercase tracking-wider">Cover</span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 text-xs">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-full border border-line px-2 py-1 hover:border-ink disabled:opacity-40">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="rounded-full border border-line px-2 py-1 hover:border-ink disabled:opacity-40">↓</button>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(url);
                        setCopied(url);
                      } catch {}
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-1 hover:border-ink"
                  >
                    <CopyIcon size={12} /> {copied === url ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-red-800 hover:bg-red-100"
                  >
                    <TrashIcon size={12} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
