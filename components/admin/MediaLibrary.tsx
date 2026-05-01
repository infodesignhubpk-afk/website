"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CopyIcon, ExternalIcon, SearchIcon, TrashIcon, UploadIcon } from "@/components/ui/Icons";
import type { R2Object } from "@/lib/r2";
import type { MediaUsageMap } from "@/lib/admin/media-usage";
import { cn } from "@/lib/utils";

type Props = {
  initialItems: R2Object[];
  initialError?: string;
  usage: MediaUsageMap;
};

const MAX_BYTES = 12 * 1024 * 1024;

type TabKey = "all" | "branding" | "general" | "products" | "blog" | "categories" | "seo";

const tabs: { key: TabKey; label: string; folder?: string; prefixes: string[] }[] = [
  { key: "all", label: "All", prefixes: [] },
  { key: "branding", label: "Branding", folder: "branding", prefixes: ["branding/"] },
  { key: "general", label: "General Images", folder: "uploads", prefixes: ["uploads/", "general/"] },
  { key: "products", label: "Products", folder: "products", prefixes: ["products/"] },
  { key: "blog", label: "Blog", folder: "blog", prefixes: ["blog/"] },
  { key: "categories", label: "Categories", folder: "categories", prefixes: ["categories/"] },
  { key: "seo", label: "SEO", folder: "seo", prefixes: ["seo/"] },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Deterministic, locale-independent date — avoids SSR/CSR hydration mismatches.
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function MediaLibrary({ initialItems, initialError, usage }: Props) {
  const [items, setItems] = useState<R2Object[]>(initialItems);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTabDef = tabs.find((t) => t.key === activeTab) ?? tabs[0];

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      if (!res.ok) throw new Error(`Reload failed (${res.status})`);
      const data = (await res.json()) as { items: R2Object[] };
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reload failed");
    }
  }

  async function uploadFiles(files: File[], folder: string) {
    setBusy(true);
    setError(null);
    try {
      for (const file of files) {
        if (file.size > MAX_BYTES) throw new Error(`${file.name} is over 12 MB.`);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) {
          let msg = `Upload failed (${res.status})`;
          try {
            const data = await res.json();
            if (data?.error) msg = data.error;
          } catch {}
          throw new Error(msg);
        }
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteOne(key: string, useCount: number) {
    const confirmMsg = useCount > 0
      ? `This image is used in ${useCount} place${useCount === 1 ? "" : "s"} and deleting it will break those references. Delete anyway?`
      : `Delete ${key} from Cloudflare R2?`;
    if (!confirm(confirmMsg)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((o) => o.key !== key));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  const filtered = useMemo(() => {
    let out = items;
    if (activeTabDef.prefixes.length > 0) {
      out = out.filter((i) => activeTabDef.prefixes.some((p) => i.key.startsWith(p)));
    }
    if (search) {
      const q = search.toLowerCase();
      out = out.filter((i) => i.key.toLowerCase().includes(q));
    }
    return out;
  }, [items, search, activeTabDef]);

  const tabCounts = useMemo(() => {
    return tabs.reduce<Record<TabKey, number>>((acc, t) => {
      acc[t.key] = t.prefixes.length === 0
        ? items.length
        : items.filter((i) => t.prefixes.some((p) => i.key.startsWith(p))).length;
      return acc;
    }, {} as Record<TabKey, number>);
  }, [items]);

  const usageStats = useMemo(() => {
    const inUse = items.filter((i) => (usage[i.url]?.count ?? 0) > 0).length;
    const orphan = items.length - inUse;
    return { inUse, orphan };
  }, [items, usage]);

  const totalSize = useMemo(() => items.reduce((s, i) => s + i.size, 0), [items]);

  const uploadFolder = activeTabDef.folder ?? "uploads";

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-2xl border border-line bg-bg p-5 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Total objects</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{items.length}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">In use</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-ink">{usageStats.inUse}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Unused (count = 0)</p>
          <p className={cn("mt-1 text-2xl font-bold tracking-tight", usageStats.orphan > 0 ? "text-red-700" : "text-ink")}>
            {usageStats.orphan}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Total size</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{formatSize(totalSize)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ul className="flex min-w-fit gap-2 border-b border-line pb-3">
          {tabs.map((t) => (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors",
                  activeTab === t.key
                    ? "border-ink bg-ink text-bg"
                    : "border-line text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                {t.label}
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px]",
                  activeTab === t.key ? "bg-bg/20 text-bg" : "bg-surface text-muted",
                )}>{tabCounts[t.key]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-bg p-5 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <SearchIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search files…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-line bg-bg py-2 pl-9 pr-4 text-sm focus:border-ink focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">
            Upload to: <code className="rounded bg-surface px-2 py-0.5 font-mono text-[11px] text-ink">{uploadFolder}/</code>
          </span>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-cta px-4 py-2 text-sm font-semibold text-ink hover:bg-cta-dark disabled:opacity-50"
          >
            <UploadIcon size={16} /> {busy ? "Working..." : "Upload"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length) void uploadFiles(files, uploadFolder);
              e.currentTarget.value = "";
            }}
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-surface p-12 text-center text-sm text-muted">
          No files in <strong>{activeTabDef.label}</strong>{search ? ` matching "${search}"` : ""}. Upload one to get started.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => {
            const isImage = /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(item.key);
            const u = usage[item.url];
            const useCount = u?.count ?? 0;
            const isInfoOpen = openInfo === item.key;
            return (
              <li key={item.key} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-bg">
                <div className="relative aspect-square bg-surface">
                  {isImage ? (
                    <Image src={item.url} alt={item.key} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" unoptimized />
                  ) : (
                    <div className="grid h-full place-items-center p-4 text-center text-xs text-muted">
                      {item.key.split("/").pop()}
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight shadow-sm",
                      useCount === 0 ? "bg-red-500 text-white" : useCount === 1 ? "bg-brand text-ink" : "bg-ink text-bg",
                    )}
                    title={useCount === 0 ? "Not used anywhere" : `Used ${useCount} time${useCount === 1 ? "" : "s"}`}
                  >
                    {useCount === 0 ? "Unused" : `${useCount} use${useCount === 1 ? "" : "s"}`}
                  </span>
                </div>
                <div className="space-y-2 p-4 text-xs">
                  <p className="break-all font-mono text-[11px] text-ink-soft" title={item.key}>{item.key}</p>
                  <p className="text-muted" suppressHydrationWarning>
                    {formatSize(item.size)} · {formatDate(item.lastModified)}
                  </p>

                  {useCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => setOpenInfo(isInfoOpen ? null : item.key)}
                      className="text-[11px] font-semibold text-ink underline-offset-2 hover:underline"
                    >
                      {isInfoOpen ? "Hide locations" : `Show where it's used (${useCount})`}
                    </button>
                  ) : null}

                  {isInfoOpen && u ? (
                    <ul className="space-y-1 rounded-lg border border-line bg-surface p-2 text-[11px]">
                      {u.locations.map((loc, i) => (
                        <li key={`${loc.label}-${i}`} className="flex items-center justify-between gap-2">
                          <span className="truncate" title={loc.label}>{loc.label}</span>
                          {loc.href ? (
                            <Link href={loc.href} className="shrink-0 font-semibold text-ink underline-offset-2 hover:underline">
                              Open
                            </Link>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(item.url);
                          setCopied(item.key);
                        } catch {}
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 hover:border-ink"
                    >
                      <CopyIcon size={12} /> {copied === item.key ? "Copied" : "Copy URL"}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 hover:border-ink"
                    >
                      <ExternalIcon size={12} /> Open
                    </a>
                    <button
                      type="button"
                      onClick={() => deleteOne(item.key, useCount)}
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-red-800 hover:bg-red-100"
                      title={useCount === 0 ? "Safe to delete (not used anywhere)" : `In use ${useCount}× — deleting will break links`}
                    >
                      <TrashIcon size={12} /> Delete
                      <span
                        className={cn(
                          "ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                          useCount === 0 ? "bg-red-200 text-red-900" : "bg-red-500 text-white",
                        )}
                      >
                        {useCount}
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
