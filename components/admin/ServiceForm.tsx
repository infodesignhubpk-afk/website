"use client";

import { startTransition, useActionState } from "react";
import { saveServiceAction, type ServiceActionResult } from "@/app/admin/_actions/services";
import { AdminButton, Field, PageTitle, StatusToast, TextArea, TextInput } from "@/components/admin/AdminUI";
import { PairRowsEditor } from "@/components/admin/PairRowsEditor";
import type { AdminService } from "@/types/admin";
import type { ServiceCategory } from "@/types";

const CATEGORY_OPTIONS: { value: ServiceCategory; label: string }[] = [
  { value: "logo", label: "Logo / Identity" },
  { value: "branding", label: "Branding" },
  { value: "printing", label: "Printing" },
  { value: "signage", label: "Signage" },
  { value: "vehicle", label: "Vehicle" },
  { value: "social", label: "Social / Digital" },
];

type Props = {
  item?: AdminService;
  otherServices: { slug: string; keyword: string }[];
  defaultIndustries: string[];
  nextOrder: number;
};

export function ServiceForm({ item, otherServices, defaultIndustries, nextOrder }: Props) {
  const [state, action, pending] = useActionState<ServiceActionResult, FormData>(saveServiceAction, {});
  const isEdit = Boolean(item);
  const related = new Set(item?.relatedSlugs ?? []);

  return (
    <form
      // Dispatched manually: a <form action> is reset by React when the action
      // settles, which would wipe this long form whenever a save fails.
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-8"
    >
      <PageTitle
        title={isEdit ? `Edit ${item?.keyword}` : "New service"}
        description={isEdit ? `Live at /services/${item?.slug}` : "Drafts are not visible on /services."}
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
            <h2 className="text-lg font-semibold tracking-tight">Basics</h2>
            <div className="mt-5 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Service name" htmlFor="keyword" required hint="Short name used on cards, menus and breadcrumbs.">
                  <TextInput id="keyword" name="keyword" defaultValue={item?.keyword} placeholder="Logo Design" required />
                </Field>
                <Field label="Category" htmlFor="category" required hint="Controls the card style and matching portfolio items.">
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
              </div>
              <Field label="Page heading (H1)" htmlFor="h1" required>
                <TextInput id="h1" name="h1" defaultValue={item?.h1} placeholder="Logo Design in Peshawar" required />
              </Field>
              <Field label="Hero subheading" htmlFor="heroSubheading" required>
                <TextArea id="heroSubheading" name="heroSubheading" defaultValue={item?.hero.subheading} rows={3} required />
              </Field>
              <Field label="Hero button text" htmlFor="heroCtaText" hint='Defaults to "Get a quote".'>
                <TextInput id="heroCtaText" name="heroCtaText" defaultValue={item?.hero.ctaText} placeholder="Start your logo project" />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
            <div className="mt-5">
              <Field label="Overview paragraphs" htmlFor="overview" required hint="Leave a blank line between paragraphs.">
                <TextArea id="overview" name="overview" defaultValue={item?.overview.join("\n\n")} rows={12} required />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Benefits</h2>
            <p className="mt-1 text-sm text-ink-soft">Six works best for the grid. Empty rows are ignored.</p>
            <div className="mt-5">
              <PairRowsEditor
                rows={item?.benefits.map((x) => [x.title, x.description]) ?? []}
                firstName="benefitTitle"
                secondName="benefitDescription"
                firstLabel="Benefit"
                secondLabel="Description"
                addLabel="Add benefit"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Process</h2>
            <div className="mt-5">
              <PairRowsEditor
                rows={item?.process.map((x) => [x.title, x.description]) ?? []}
                firstName="processTitle"
                secondName="processDescription"
                firstLabel="Step"
                secondLabel="Description"
                addLabel="Add step"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Use cases</h2>
            <div className="mt-5">
              <Field label="Use cases" htmlFor="useCases" hint="One per line.">
                <TextArea id="useCases" name="useCases" defaultValue={item?.useCases.join("\n")} rows={6} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">FAQs</h2>
            <p className="mt-1 text-sm text-ink-soft">Also published as FAQ rich results in Google.</p>
            <div className="mt-5">
              <PairRowsEditor
                rows={item?.faqs.map((x) => [x.question, x.answer]) ?? []}
                firstName="faqQuestion"
                secondName="faqAnswer"
                firstLabel="Question"
                secondLabel="Answer"
                addLabel="Add FAQ"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">SEO</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Meta title" htmlFor="metaTitle" required hint="Aim for 60 characters or fewer.">
                <TextInput id="metaTitle" name="metaTitle" defaultValue={item?.metaTitle} required />
              </Field>
              <Field
                label="Meta description"
                htmlFor="metaDescription"
                required
                hint="Aim for 160 characters or fewer. The first sentence is also shown on service cards."
              >
                <TextArea id="metaDescription" name="metaDescription" defaultValue={item?.metaDescription} rows={3} required />
              </Field>
              <Field
                label="Slug"
                htmlFor="slug"
                hint={
                  isEdit
                    ? "Changing this changes the live URL, and links to the old one will 404. Always ends in -peshawar."
                    : "Generated from the service name if left empty. Always ends in -peshawar."
                }
              >
                <TextInput id="slug" name="slug" defaultValue={item?.slug} placeholder="logo-design-peshawar" />
              </Field>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Publish</h2>
            <div className="mt-5 grid gap-5">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={item?.published ?? true}
                  className="h-4 w-4 rounded border-line"
                />
                Published (visible on /services)
              </label>
              <Field label="Display order" htmlFor="order" hint="Lower numbers show first.">
                <TextInput id="order" name="order" type="number" min={0} defaultValue={item?.order ?? nextOrder} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Related services</h2>
            <p className="mt-1 text-sm text-ink-soft">Pick three to fill the row.</p>
            <ul className="mt-5 grid gap-2">
              {otherServices.map((o) => (
                <li key={o.slug}>
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      name="relatedSlugs"
                      value={o.slug}
                      defaultChecked={related.has(o.slug)}
                      className="h-4 w-4 rounded border-line"
                    />
                    {o.keyword}
                  </label>
                </li>
              ))}
              {otherServices.length === 0 ? <li className="text-sm text-muted">No other services yet.</li> : null}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-6">
            <h2 className="text-lg font-semibold tracking-tight">Industries</h2>
            <div className="mt-5">
              <Field label="Industries served" htmlFor="industries" hint="One per line.">
                <TextArea
                  id="industries"
                  name="industries"
                  defaultValue={(item?.industries ?? defaultIndustries).join("\n")}
                  rows={10}
                />
              </Field>
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
