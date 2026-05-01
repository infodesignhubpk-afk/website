import "server-only";
import { readJson, writeJson, newId, slugify } from "@/lib/store";
import type { AdminCategory } from "@/types/admin";

const FILE = "categories.json";

const seed: AdminCategory[] = [
  { id: "cat_seed_signage", slug: "signage-products", name: "Signage Products", description: "Acrylic letters, lightboxes, monolith pylons and finished installation pieces.", order: 1 },
  { id: "cat_seed_print", slug: "print-products", name: "Print Products", description: "Business cards, brochures, catalogues, packaging and stationery.", order: 2 },
  { id: "cat_seed_branding", slug: "branding-bundles", name: "Branding Bundles", description: "Bundled identity packages for new businesses and refresh projects.", order: 3 },
];

export async function listCategories(): Promise<AdminCategory[]> {
  const all = await readJson<AdminCategory[] | null>(FILE, null);
  if (!all) {
    await writeJson(FILE, seed);
    return [...seed].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }
  return [...all].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export async function getCategoryById(id: string): Promise<AdminCategory | null> {
  const all = await listCategories();
  return all.find((c) => c.id === id) ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<AdminCategory | null> {
  const all = await listCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function createCategory(input: Omit<AdminCategory, "id" | "slug"> & { slug?: string }): Promise<AdminCategory> {
  const all = await listCategories();
  const baseSlug = input.slug?.trim() || slugify(input.name);
  const slug = uniqueSlug(baseSlug, all.map((c) => c.slug));
  const cat: AdminCategory = { ...input, slug, id: newId("cat") };
  await writeJson(FILE, [...all, cat]);
  return cat;
}

export async function updateCategory(id: string, input: Partial<Omit<AdminCategory, "id">>): Promise<AdminCategory | null> {
  const all = await listCategories();
  const i = all.findIndex((c) => c.id === id);
  if (i < 0) return null;
  const next: AdminCategory = { ...all[i], ...input, id };
  if (input.slug) {
    next.slug = uniqueSlug(slugify(input.slug), all.filter((c) => c.id !== id).map((c) => c.slug));
  }
  const arr = [...all];
  arr[i] = next;
  await writeJson(FILE, arr);
  return next;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const all = await listCategories();
  const next = all.filter((c) => c.id !== id);
  if (next.length === all.length) return false;
  await writeJson(FILE, next);
  return true;
}

function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
