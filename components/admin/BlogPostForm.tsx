"use client";

import { useActionState, useState } from "react";
import { saveBlogPostAction, type BlogActionResult } from "@/app/admin/_actions/blogs";
import { AdminButton, Field, PageTitle, StatusToast, TextArea, TextInput } from "@/components/admin/AdminUI";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type { AdminBlogPost } from "@/types/admin";

export function BlogPostForm({ post }: { post?: AdminBlogPost }) {
  const [state, action, pending] = useActionState<BlogActionResult, FormData>(saveBlogPostAction, {});
  const [image, setImage] = useState(post?.image ?? "");
  const isEdit = Boolean(post);

  return (
    <form action={action} className="space-y-8">
      <PageTitle
        title={isEdit ? "Edit blog post" : "New blog post"}
        description={isEdit ? `Slug: /blog/${post?.slug}` : "Drafts are not visible on the public blog."}
        actions={
          <AdminButton variant="primary" type="submit" disabled={pending}>
            {pending ? "Saving..." : isEdit ? "Save changes" : "Create post"}
          </AdminButton>
        }
      />

      <StatusToast error={state.error} />

      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Content</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Title" htmlFor="title" required>
                <TextInput id="title" name="title" defaultValue={post?.title} required />
              </Field>
              <Field label="Excerpt" htmlFor="excerpt" hint="Shown on the blog index and used as fallback meta description.">
                <TextArea id="excerpt" name="excerpt" defaultValue={post?.excerpt} rows={2} />
              </Field>
              <Field label="Body" htmlFor="body" required hint="Separate paragraphs with a blank line.">
                <TextArea id="body" name="body" defaultValue={post?.body.join("\n\n")} rows={16} required />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">SEO</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Meta title (optional)" htmlFor="metaTitle">
                <TextInput id="metaTitle" name="metaTitle" defaultValue={post?.metaTitle} />
              </Field>
              <Field label="Meta description (optional)" htmlFor="metaDescription">
                <TextArea id="metaDescription" name="metaDescription" defaultValue={post?.metaDescription} rows={2} />
              </Field>
              <Field label="Slug (optional)" htmlFor="slug" hint="Generated from title if left empty.">
                <TextInput id="slug" name="slug" defaultValue={post?.slug} />
              </Field>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Publish</h2>
            <div className="mt-5 grid gap-5">
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="h-4 w-4 rounded border-line" />
                Published (visible on blog)
              </label>
              <Field label="Date (YYYY-MM-DD)" htmlFor="date">
                <TextInput id="date" name="date" type="date" defaultValue={post?.date ?? new Date().toISOString().slice(0, 10)} />
              </Field>
              <Field label="Author" htmlFor="author">
                <TextInput id="author" name="author" defaultValue={post?.author ?? "Design Hub Studio"} />
              </Field>
              <Field label="Reading minutes" htmlFor="readingMinutes">
                <TextInput id="readingMinutes" name="readingMinutes" type="number" min={1} max={60} defaultValue={post?.readingMinutes ?? 5} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Cover image</h2>
            <div className="mt-5">
              <MediaPicker label="Cover" value={image} onChange={setImage} folder="blog" recommended="1600×900 JPG/PNG" />
              <input type="hidden" name="image" value={image} />
            </div>
          </section>
        </aside>
      </div>

      <div className="flex justify-end">
        <AdminButton variant="primary" type="submit" disabled={pending}>
          {pending ? "Saving..." : isEdit ? "Save changes" : "Create post"}
        </AdminButton>
      </div>
    </form>
  );
}
