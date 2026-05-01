"use client";

import { useActionState, useState } from "react";
import { saveSiteAction, type ActionResult } from "@/app/admin/_actions/site";
import { AdminButton, Field, PageTitle, StatusToast, TextInput, TextArea } from "@/components/admin/AdminUI";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type { SiteSettings } from "@/types/admin";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(saveSiteAction, {});
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [logoWhiteUrl, setLogoWhiteUrl] = useState(settings.logoWhiteUrl);
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl);

  return (
    <form action={action} className="space-y-8">
      <PageTitle
        title="Site Settings"
        description="Business identity, contact details and branding. These values flow into the header, footer, contact page and JSON-LD."
        actions={<AdminButton variant="primary" type="submit" disabled={pending}>{pending ? "Saving..." : "Save changes"}</AdminButton>}
      />

      <StatusToast ok={state.ok} error={state.error} />

      <section className="rounded-2xl border border-line bg-bg p-6">
        <h2 className="text-lg font-semibold tracking-tight">Identity</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Business name" htmlFor="name" required>
            <TextInput id="name" name="name" defaultValue={settings.name} required />
          </Field>
          <Field label="Legal name" htmlFor="legalName">
            <TextInput id="legalName" name="legalName" defaultValue={settings.legalName} />
          </Field>
          <Field label="Public site URL" htmlFor="url" required>
            <TextInput id="url" name="url" type="url" defaultValue={settings.url} required />
          </Field>
          <Field label="Short description" htmlFor="shortDescription" className="md:col-span-2">
            <TextArea id="shortDescription" name="shortDescription" defaultValue={settings.shortDescription} rows={2} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-bg p-6">
        <h2 className="text-lg font-semibold tracking-tight">Brand assets</h2>
        <p className="mt-1 text-sm text-ink-soft">Uploaded to Cloudflare R2. The light logo is used in the header (white background); the white logo is used in the footer (dark background); the favicon updates browser tabs.</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <MediaPicker
            label="Logo (light backgrounds — used in header)"
            value={logoUrl}
            onChange={setLogoUrl}
            folder="branding"
            recommended="SVG or PNG, 240×72 px transparent, dark colour"
          />
          <input type="hidden" name="logoUrl" value={logoUrl} />
          <MediaPicker
            label="Logo (dark backgrounds — used in footer)"
            value={logoWhiteUrl}
            onChange={setLogoWhiteUrl}
            folder="branding"
            recommended="SVG or PNG, 240×72 px transparent, white colour"
          />
          <input type="hidden" name="logoWhiteUrl" value={logoWhiteUrl} />
          <MediaPicker
            label="Favicon"
            value={faviconUrl}
            onChange={setFaviconUrl}
            folder="branding"
            recommended="PNG or ICO, square 256×256 px"
          />
          <input type="hidden" name="faviconUrl" value={faviconUrl} />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-bg p-6">
        <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Phone (international with +)" htmlFor="phone" required>
            <TextInput id="phone" name="phone" type="tel" defaultValue={settings.phone} required />
          </Field>
          <Field label="Phone (display)" htmlFor="phoneDisplay">
            <TextInput id="phoneDisplay" name="phoneDisplay" defaultValue={settings.phoneDisplay} />
          </Field>
          <Field label="WhatsApp number (digits only)" htmlFor="whatsappNumber" required>
            <TextInput id="whatsappNumber" name="whatsappNumber" defaultValue={settings.whatsappNumber} required />
          </Field>
          <Field label="Email" htmlFor="email" required>
            <TextInput id="email" name="email" type="email" defaultValue={settings.email} required />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-bg p-6">
        <h2 className="text-lg font-semibold tracking-tight">Address</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Street" htmlFor="street" className="md:col-span-2">
            <TextInput id="street" name="street" defaultValue={settings.street} />
          </Field>
          <Field label="City / Locality" htmlFor="locality">
            <TextInput id="locality" name="locality" defaultValue={settings.locality} />
          </Field>
          <Field label="Region / Province" htmlFor="region">
            <TextInput id="region" name="region" defaultValue={settings.region} />
          </Field>
          <Field label="Postal code" htmlFor="postalCode">
            <TextInput id="postalCode" name="postalCode" defaultValue={settings.postalCode} />
          </Field>
          <Field label="Country (ISO)" htmlFor="country">
            <TextInput id="country" name="country" defaultValue={settings.country} />
          </Field>
          <Field label="Latitude" htmlFor="latitude">
            <TextInput id="latitude" name="latitude" type="number" step="any" defaultValue={settings.latitude} />
          </Field>
          <Field label="Longitude" htmlFor="longitude">
            <TextInput id="longitude" name="longitude" type="number" step="any" defaultValue={settings.longitude} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-bg p-6">
        <h2 className="text-lg font-semibold tracking-tight">Social links</h2>
        <p className="mt-1 text-sm text-ink-soft">Leave empty to hide an icon from the footer.</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Facebook URL" htmlFor="facebook">
            <TextInput id="facebook" name="facebook" type="url" defaultValue={settings.facebook} placeholder="https://facebook.com/…" />
          </Field>
          <Field label="Instagram URL" htmlFor="instagram">
            <TextInput id="instagram" name="instagram" type="url" defaultValue={settings.instagram} />
          </Field>
          <Field label="LinkedIn URL" htmlFor="linkedin">
            <TextInput id="linkedin" name="linkedin" type="url" defaultValue={settings.linkedin} />
          </Field>
          <Field label="YouTube URL" htmlFor="youtube">
            <TextInput id="youtube" name="youtube" type="url" defaultValue={settings.youtube} />
          </Field>
          <Field label="TikTok URL" htmlFor="tiktok">
            <TextInput id="tiktok" name="tiktok" type="url" defaultValue={settings.tiktok} />
          </Field>
          <Field label="WhatsApp Channel URL" htmlFor="whatsappChannel">
            <TextInput id="whatsappChannel" name="whatsappChannel" type="url" defaultValue={settings.whatsappChannel} />
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
