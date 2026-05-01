"use client";

import { useActionState, useState } from "react";
import { saveSeoAction, type ActionResult } from "@/app/admin/_actions/site";
import { AdminButton, Field, PageTitle, StatusToast, TextArea, TextInput } from "@/components/admin/AdminUI";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type { SeoSettings } from "@/types/admin";

export function SeoSettingsForm({ settings }: { settings: SeoSettings }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(saveSeoAction, {});
  const [ogImage, setOgImage] = useState(settings.defaultOgImage);

  return (
    <form action={action} className="space-y-8">
      <PageTitle
        title="SEO Settings"
        description="Defaults applied to every page. Individual pages override title and description; everything else flows from here."
        actions={<AdminButton variant="primary" type="submit" disabled={pending}>{pending ? "Saving..." : "Save changes"}</AdminButton>}
      />

      <StatusToast ok={state.ok} error={state.error} />

      <section className="rounded-2xl border border-line bg-bg p-6">
        <h2 className="text-lg font-semibold tracking-tight">Defaults</h2>
        <div className="mt-5 grid gap-5">
          <Field label="Default title" htmlFor="defaultTitle" required>
            <TextInput id="defaultTitle" name="defaultTitle" defaultValue={settings.defaultTitle} required />
          </Field>
          <Field label="Default description" htmlFor="defaultDescription" hint="140–160 characters reads well in Google snippets.">
            <TextArea id="defaultDescription" name="defaultDescription" defaultValue={settings.defaultDescription} rows={3} />
          </Field>
          <Field label="Keywords (comma-separated)" htmlFor="keywords">
            <TextInput id="keywords" name="keywords" defaultValue={settings.keywords.join(", ")} />
          </Field>
          <MediaPicker
            label="Default Open Graph image"
            value={ogImage}
            onChange={setOgImage}
            folder="seo"
            recommended="1200×630 PNG/JPG"
          />
          <input type="hidden" name="defaultOgImage" value={ogImage} />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-bg p-6">
        <h2 className="text-lg font-semibold tracking-tight">Verification & analytics</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Google Search Console verification" htmlFor="gscVerification" hint="Just the meta-tag value.">
            <TextInput id="gscVerification" name="gscVerification" defaultValue={settings.gscVerification} />
          </Field>
          <Field label="Google Analytics 4 ID" htmlFor="gaId" hint="Format: G-XXXXXXXXXX">
            <TextInput id="gaId" name="gaId" defaultValue={settings.gaId} />
          </Field>
          <Field label="Twitter / X handle" htmlFor="twitterHandle" hint="@designhub">
            <TextInput id="twitterHandle" name="twitterHandle" defaultValue={settings.twitterHandle} />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <AdminButton variant="primary" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </AdminButton>
      </div>
    </form>
  );
}
