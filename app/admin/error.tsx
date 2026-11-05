"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AdminButton } from "@/components/admin/AdminUI";

// Catches anything an admin page throws (a D1 outage, a malformed stored row)
// so staff get a way back instead of Next's bare error screen. In production a
// server error arrives here with only a generic message and a digest; the real
// message stays in the server logs, so none of it is shown.
export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : undefined;

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-line bg-bg p-8 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-sm text-ink-soft">
        This page could not be loaded. It may be a temporary problem with the database; try again in a moment.
      </p>
      {digest ? <p className="mt-2 font-mono text-xs text-muted">Error reference: {digest}</p> : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {/* retry() re-fetches the segment from the server; reset() would only re-render the failed payload. */}
        <AdminButton type="button" onClick={() => retry()}>
          Try again
        </AdminButton>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-bg px-4 py-2 text-sm font-semibold text-ink hover:border-ink"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
