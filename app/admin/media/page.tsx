import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listR2Objects, r2Configured } from "@/lib/r2";
import { PageTitle } from "@/components/admin/AdminUI";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { buildMediaUsage } from "@/lib/admin/media-usage";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  if (!(await isAuthenticated())) redirect("/admin");

  if (!r2Configured) {
    return (
      <div className="space-y-8">
        <PageTitle title="Media" description="Upload, browse and manage Cloudflare R2 assets." />
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm">
          <p className="font-semibold text-amber-900">Cloudflare R2 is not configured.</p>
          <p className="mt-2 text-amber-900">
            Add the following to <code>.env.local</code> and restart the dev server:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-3 text-xs">{`R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=...
R2_PUBLIC_BASE_URL=https://pub-<id>.r2.dev`}</pre>
        </div>
      </div>
    );
  }

  let items: Awaited<ReturnType<typeof listR2Objects>> = [];
  let error: string | undefined;
  try {
    items = await listR2Objects();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load media.";
  }

  const usage = await buildMediaUsage();
  const inUse = items.filter((i) => (usage[i.url]?.count ?? 0) > 0).length;
  const orphan = items.length - inUse;

  return (
    <div className="space-y-8">
      <PageTitle
        title="Media"
        description={`Cloudflare R2 bucket — ${items.length} object${items.length === 1 ? "" : "s"} · ${inUse} in use · ${orphan} unused.`}
      />
      <MediaLibrary initialItems={items} initialError={error} usage={usage} />
    </div>
  );
}
