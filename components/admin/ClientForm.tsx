"use client";

import { useActionState, useState } from "react";
import { saveClientAction, type ClientActionResult } from "@/app/admin/_actions/clients";
import { AdminButton, Field, PageTitle, StatusToast, TextInput } from "@/components/admin/AdminUI";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type { AdminClient } from "@/types/admin";

export function ClientForm({ client }: { client?: AdminClient }) {
  const [state, action, pending] = useActionState<ClientActionResult, FormData>(saveClientAction, {});
  const [logoUrl, setLogoUrl] = useState(client?.logoUrl ?? "");
  const isEdit = Boolean(client);

  return (
    <form action={action} className="space-y-8">
      <PageTitle
        title={isEdit ? "Edit client" : "New client"}
        description="Logos appear in the homepage trust bar."
        actions={
          <AdminButton variant="primary" type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </AdminButton>
        }
      />

      <StatusToast error={state.error} />

      {client ? <input type="hidden" name="id" value={client.id} /> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-5 rounded-2xl border border-line bg-bg p-6 lg:col-span-2">
          <Field label="Name" htmlFor="name" required hint="Used as alt text and as a fallback when no logo is set.">
            <TextInput id="name" name="name" defaultValue={client?.name} required />
          </Field>
          <Field label="Website (optional)" htmlFor="linkUrl">
            <TextInput id="linkUrl" name="linkUrl" type="url" defaultValue={client?.linkUrl} placeholder="https://" />
          </Field>
          <Field label="Display order" htmlFor="order" hint="Lower numbers show first.">
            <TextInput id="order" name="order" type="number" defaultValue={client?.order ?? 999} />
          </Field>
        </section>

        <aside className="space-y-5 rounded-2xl border border-line bg-bg p-6">
          <h2 className="text-lg font-semibold tracking-tight">Logo</h2>
          <MediaPicker
            label="Client logo"
            value={logoUrl}
            onChange={setLogoUrl}
            folder="clients"
            recommended="200×80 PNG (transparent) or SVG"
          />
          <input type="hidden" name="logoUrl" value={logoUrl} />
        </aside>
      </div>

      <div className="flex justify-end">
        <AdminButton variant="primary" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </AdminButton>
      </div>
    </form>
  );
}
