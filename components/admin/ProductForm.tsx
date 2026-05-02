"use client";

import { useActionState, useState } from "react";
import { saveProductAction, type ProductActionResult } from "@/app/admin/_actions/products";
import { AdminButton, Field, PageTitle, StatusToast, TextArea, TextInput } from "@/components/admin/AdminUI";
import { ImageGalleryEditor } from "@/components/admin/ImageGalleryEditor";
import { QuillEditor } from "@/components/admin/QuillEditor";
import type { AdminCategory, AdminProduct } from "@/types/admin";

export function ProductForm({ product, categories }: { product?: AdminProduct; categories: AdminCategory[] }) {
  const [state, action, pending] = useActionState<ProductActionResult, FormData>(saveProductAction, {});
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.categoryIds ?? []);
  const [description, setDescription] = useState(product?.description ?? "");
  const isEdit = Boolean(product);

  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <form action={action} className="space-y-8">
      <PageTitle
        title={isEdit ? "Edit product" : "New product"}
        description={isEdit ? `Slug: /products/${product?.slug}` : "Products are visible on the storefront when published."}
        actions={<AdminButton variant="primary" type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</AdminButton>}
      />

      <StatusToast error={state.error} />

      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="categoryIds" value={JSON.stringify(categoryIds)} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Basics</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Name" htmlFor="name" required>
                <TextInput id="name" name="name" defaultValue={product?.name} required />
              </Field>
              <Field label="Short description" htmlFor="shortDescription">
                <TextArea id="shortDescription" name="shortDescription" defaultValue={product?.shortDescription} rows={2} />
              </Field>
              <Field label="Full description" htmlFor="description">
                <TextArea id="description" name="description" defaultValue={product?.description} rows={6} />
              </Field>
              <Field label="Features (one per line)" htmlFor="features">
                <TextArea id="features" name="features" defaultValue={product?.features.join("\n")} rows={6} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Images</h2>
            <div className="mt-5">
              <ImageGalleryEditor value={images} onChange={setImages} folder="products" />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">SEO</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Meta title" htmlFor="metaTitle">
                <TextInput id="metaTitle" name="metaTitle" defaultValue={product?.metaTitle} />
              </Field>
              <Field label="Meta description" htmlFor="metaDescription">
                <TextArea id="metaDescription" name="metaDescription" defaultValue={product?.metaDescription} rows={2} />
              </Field>
              <Field label="Slug (optional)" htmlFor="slug">
                <TextInput id="slug" name="slug" defaultValue={product?.slug} />
              </Field>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Pricing & status</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Price" htmlFor="price" required>
                <TextInput id="price" name="price" type="number" min={0} step="any" defaultValue={product?.price ?? 0} required />
              </Field>
              <Field label="Currency" htmlFor="currency">
                <TextInput id="currency" name="currency" defaultValue={product?.currency ?? "PKR"} />
              </Field>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" name="published" defaultChecked={product?.published ?? true} className="h-4 w-4 rounded border-line" />
                Published (visible on /products)
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} className="h-4 w-4 rounded border-line" />
                In stock
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Categories</h2>
            {categories.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No categories yet — create one first.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {categories.map((c) => {
                  const checked = categoryIds.includes(c.id);
                  return (
                    <li key={c.id}>
                      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 hover:border-ink">
                        <span>{c.name}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(c.id)}
                          className="h-4 w-4 rounded border-line"
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </aside>
      </div>

      <div className="flex justify-end">
        <AdminButton variant="primary" type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</AdminButton>
      </div>
    </form>
  );
}
