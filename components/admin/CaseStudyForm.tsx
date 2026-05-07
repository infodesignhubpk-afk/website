"use client";

import { useActionState, useState } from "react";
import { saveCaseStudyAction, type CaseStudyActionResult } from "@/app/admin/_actions/case-studies";
import { AdminButton, Field, PageTitle, StatusToast, TextArea, TextInput } from "@/components/admin/AdminUI";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type { AdminCaseStudy } from "@/types/admin";
import type { ServiceCategory } from "@/types";

const CATEGORY_OPTIONS: { value: ServiceCategory; label: string }[] = [
  { value: "logo", label: "Logo / Identity" },
  { value: "branding", label: "Branding" },
  { value: "printing", label: "Printing" },
  { value: "signage", label: "Signage" },
  { value: "vehicle", label: "Vehicle" },
  { value: "social", label: "Social / Digital" },
];

function metricRows(item?: AdminCaseStudy) {
  const rows = item?.metrics.length ? item.metrics : [{ label: "", value: "" }];
  return Array.from({ length: Math.max(4, rows.length) }, (_, i) => rows[i] ?? { label: "", value: "" });
}

export function CaseStudyForm({ item }: { item?: AdminCaseStudy }) {
  const [state, action, pending] = useActionState<CaseStudyActionResult, FormData>(saveCaseStudyAction, {});
  const [image, setImage] = useState(item?.image ?? "");
  const isEdit = Boolean(item);

  return (
    <form action={action} className="space-y-8">
      <PageTitle
        title={isEdit ? "Edit case study" : "New case study"}
        description={isEdit ? `Slug: /case-studies/${item?.slug}` : "Drafts are not visible on /case-studies."}
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
            <h2 className="text-lg font-semibold tracking-tight">Story</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Title" htmlFor="title" required>
                <TextInput id="title" name="title" defaultValue={item?.title} required />
              </Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Client" htmlFor="client" required>
                  <TextInput id="client" name="client" defaultValue={item?.client} required />
                </Field>
                <Field label="Industry" htmlFor="industry" required>
                  <TextInput id="industry" name="industry" defaultValue={item?.industry} required />
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
              <Field label="Summary" htmlFor="summary" required hint="Shown on the case studies index and as fallback meta description.">
                <TextArea id="summary" name="summary" defaultValue={item?.summary} rows={3} required />
              </Field>
              <Field label="Challenge" htmlFor="challenge" required>
                <TextArea id="challenge" name="challenge" defaultValue={item?.challenge} rows={5} required />
              </Field>
              <Field label="Approach" htmlFor="approach" required>
                <TextArea id="approach" name="approach" defaultValue={item?.approach} rows={5} required />
              </Field>
              <Field label="Outcome" htmlFor="outcome" required>
                <TextArea id="outcome" name="outcome" defaultValue={item?.outcome} rows={5} required />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Metrics</h2>
            <div className="mt-5 grid gap-4">
              {metricRows(item).map((m, i) => (
                <div key={i} className="grid gap-3 md:grid-cols-[0.75fr_1.25fr]">
                  <Field label={`Value ${i + 1}`} htmlFor={`metricValue-${i}`}>
                    <TextInput id={`metricValue-${i}`} name="metricValue" defaultValue={m.value} placeholder="40%" />
                  </Field>
                  <Field label={`Label ${i + 1}`} htmlFor={`metricLabel-${i}`}>
                    <TextInput id={`metricLabel-${i}`} name="metricLabel" defaultValue={m.label} placeholder="Cost-per-lead vs budget" />
                  </Field>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">SEO</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Meta title (optional)" htmlFor="metaTitle">
                <TextInput id="metaTitle" name="metaTitle" defaultValue={item?.metaTitle} />
              </Field>
              <Field label="Meta description (optional)" htmlFor="metaDescription">
                <TextArea id="metaDescription" name="metaDescription" defaultValue={item?.metaDescription} rows={2} />
              </Field>
              <Field label="Slug (optional)" htmlFor="slug" hint="Generated from client or title if left empty.">
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
                Published (visible on /case-studies)
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Cover image</h2>
            <div className="mt-5">
              <MediaPicker label="Cover" value={image} onChange={setImage} folder="case-studies" recommended="1600x1000 JPG/PNG" />
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
