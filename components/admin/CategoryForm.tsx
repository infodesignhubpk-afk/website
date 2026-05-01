"use client";

import { useActionState, useState } from "react";
import { saveCategoryAction, type CategoryActionResult } from "@/app/admin/_actions/categories";
import { AdminButton, Field, PageTitle, StatusToast, TextArea, TextInput } from "@/components/admin/AdminUI";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type { AdminCategory } from "@/types/admin";

export function CategoryForm({ category }: { category?: AdminCategory }) {
  const [state, action, pending] = useActionState<CategoryActionResult, FormData>(saveCategoryAction, {});
  const [image, setImage] = useState(category?.image ?? "");
  const isEdit = Boolean(category);
  return (
    <form action={action} className="space-y-8">
      <PageTitle
        title={isEdit ? "Edit category" : "New category"}
        description={isEdit ? `Slug: ${category?.slug}` : "Categories group products on the storefront."}
        actions={<AdminButton variant="primary" type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</AdminButton>}
      />
      <StatusToast error={state.error} />
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-5 rounded-2xl border border-line bg-bg p-6 lg:col-span-2">
          <Field label="Name" htmlFor="name" required>
            <TextInput id="name" name="name" defaultValue={category?.name} required />
          </Field>
          <Field label="Description" htmlFor="description">
            <TextArea id="description" name="description" defaultValue={category?.description} rows={3} />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Slug (optional)" htmlFor="slug">
              <TextInput id="slug" name="slug" defaultValue={category?.slug} />
            </Field>
            <Field label="Display order" htmlFor="order">
              <TextInput id="order" name="order" type="number" defaultValue={category?.order ?? 999} />
            </Field>
          </div>
        </section>

        <aside className="space-y-5 rounded-2xl border border-line bg-bg p-6">
          <h2 className="text-lg font-semibold tracking-tight">Image</h2>
          <MediaPicker label="Cover" value={image} onChange={setImage} folder="categories" recommended="800×600 JPG/PNG" />
          <input type="hidden" name="image" value={image} />
        </aside>
      </div>

      <div className="flex justify-end">
        <AdminButton variant="primary" type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</AdminButton>
      </div>
    </form>
  );
}
