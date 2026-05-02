"use client";

import { useActionState, useState } from "react";
import { savePortfolioItemAction, type PortfolioActionResult } from "@/app/admin/_actions/portfolio";
import { AdminButton, Field, PageTitle, StatusToast, TextArea, TextInput } from "@/components/admin/AdminUI";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { QuillEditor } from "@/components/admin/QuillEditor";
import type { AdminPortfolioItem } from "@/types/admin";
import type { ServiceCategory } from "@/types";

const CATEGORY_OPTIONS: { value: ServiceCategory; label: string }[] = [
  { value: "logo", label: "Logo / Identity" },
  { value: "branding", label: "Branding" },
  { value: "printing", label: "Printing" },
  { value: "signage", label: "Signage" },
  { value: "vehicle", label: "Vehicle" },
  { value: "social", label: "Social / Digital" },
];

export function PortfolioForm({ item }: { item?: AdminPortfolioItem }) {
  const [state, action, pending] = useActionState<PortfolioActionResult, FormData>(savePortfolioItemAction, {});
  const [image, setImage] = useState(item?.image ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const isEdit = Boolean(item);

  return (
    <form action={action} className="space-y-8">
      <PageTitle
        title={isEdit ? "Edit portfolio item" : "New portfolio item"}
        description={isEdit ? `Slug: /portfolio/${item?.slug}` : "Drafts are not visible on /portfolio."}
        actions={
          <AdminButton variant="primary" type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </AdminButton>
        }
      />

      <StatusToast error={state.error} />

      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Project</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Title" htmlFor="title" required>
                <TextInput id="title" name="title" defaultValue={item?.title} required />
              </Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Client" htmlFor="client" required>
                  <TextInput id="client" name="client" defaultValue={item?.client} required />
                </Field>
                <Field label="Year" htmlFor="year">
                  <TextInput id="year" name="year" type="number" min={2000} max={2100} defaultValue={item?.year ?? new Date().getFullYear()} />
                </Field>
              </div>
              <Field label="Category" htmlFor="category" required>
                <select
                  id="category"
                  name="category"
                  defaultValue={item?.category ?? "branding"}
                  className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Summary" htmlFor="summary" required hint="Shown on the portfolio card.">
                <TextArea id="summary" name="summary" defaultValue={item?.summary} rows={2} required />
              </Field>
              <Field label="Description (optional)" htmlFor="description" hint="Rich text — shown on the project detail page.">
                <QuillEditor value={description} onChange={setDescription} placeholder="Tell the project story…" minHeight={200} />
                <input type="hidden" name="description" value={description} />
              </Field>
              <Field label="Slug (optional)" htmlFor="slug" hint="Generated from title if left empty.">
                <TextInput id="slug" name="slug" defaultValue={item?.slug} />
              </Field>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Publish</h2>
            <div className="mt-5">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={item?.published ?? true}
                  className="h-4 w-4 rounded border-line"
                />
                Published (visible on /portfolio)
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Cover image</h2>
            <div className="mt-5">
              <MediaPicker label="Cover" value={image} onChange={setImage} folder="portfolio" recommended="1600×1200 JPG/PNG" />
              <input type="hidden" name="image" value={image} />
            </div>
          </section>
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
