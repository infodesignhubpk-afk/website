import "server-only";
import { d1All, d1Exec, d1Configured, nowMs } from "@/lib/db";
import { newId, slugify } from "@/lib/store";
import type { AdminCategory } from "@/types/admin";

type CategoryRow = {
  id: string;
  slug: string;
  data: string;
  sort_order: number;
  created_at: number;
  updated_at: number;
};

function rowToCategory(row: CategoryRow): AdminCategory {
  const parsed = JSON.parse(row.data) as AdminCategory;
  return { ...parsed, id: row.id, slug: row.slug, order: row.sort_order };
}

const seed: AdminCategory[] = [
  { id: "cat_seed_signage", slug: "signage-products", name: "Signage Products", description: "Acrylic letters, lightboxes, monolith pylons and finished installation pieces.", order: 1 },
  { id: "cat_seed_print", slug: "print-products", name: "Print Products", description: "Business cards, brochures, catalogues, packaging and stationery.", order: 2 },
  { id: "cat_seed_branding", slug: "branding-bundles", name: "Branding Bundles", description: "Bundled identity packages for new businesses and refresh projects.", order: 3 },
];

let _seeded = false;
async function ensureSeed(): Promise<void> {
  if (_seeded || !d1Configured) return;
  try {
    const rows = await d1All<{ count: number }>("SELECT COUNT(*) AS count FROM categories");
    if ((rows[0]?.count ?? 0) > 0) {
      _seeded = true;
      return;
    }
    const now = nowMs();
    for (const c of seed) {
      await d1Exec(
        `INSERT OR IGNORE INTO categories (id, slug, data, sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [c.id, c.slug, JSON.stringify(c), c.order, now, now],
      );
    }
    _seeded = true;
  } catch (err) {
    console.warn("[categories] seed failed:", err);
  }
}

export async function listCategories(): Promise<AdminCategory[]> {
  if (!d1Configured) return [];
  await ensureSeed();
  try {
    const rows = await d1All<CategoryRow>(
      "SELECT id, slug, data, sort_order, created_at, updated_at FROM categories ORDER BY sort_order ASC",
    );
    return rows.map(rowToCategory);
  } catch (err) {
    console.warn("[categories] list failed:", err);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<AdminCategory | null> {
  if (!d1Configured) return null;
  await ensureSeed();
  const rows = await d1All<CategoryRow>(
    "SELECT id, slug, data, sort_order, created_at, updated_at FROM categories WHERE id = ?",
    [id],
  );
  return rows[0] ? rowToCategory(rows[0]) : null;
}

export async function getCategoryBySlug(slug: string): Promise<AdminCategory | null> {
  if (!d1Configured) return null;
  await ensureSeed();
  const rows = await d1All<CategoryRow>(
    "SELECT id, slug, data, sort_order, created_at, updated_at FROM categories WHERE slug = ?",
    [slug],
  );
  return rows[0] ? rowToCategory(rows[0]) : null;
}

export async function createCategory(
  input: Omit<AdminCategory, "id" | "slug"> & { slug?: string },
): Promise<AdminCategory> {
  const all = await listCategories();
  const baseSlug = input.slug?.trim() || slugify(input.name);
  const slug = uniqueSlug(baseSlug, all.map((c) => c.slug));
  const id = newId("cat");
  const cat: AdminCategory = { ...input, slug, id };
  const now = nowMs();
  await d1Exec(
    `INSERT INTO categories (id, slug, data, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, slug, JSON.stringify(cat), cat.order, now, now],
  );
  return cat;
}

export async function updateCategory(
  id: string,
  input: Partial<Omit<AdminCategory, "id">>,
): Promise<AdminCategory | null> {
  const current = await getCategoryById(id);
  if (!current) return null;
  const next: AdminCategory = { ...current, ...input, id };
  if (input.slug) {
    const all = await listCategories();
    next.slug = uniqueSlug(slugify(input.slug), all.filter((c) => c.id !== id).map((c) => c.slug));
  }
  await d1Exec(
    `UPDATE categories SET slug = ?, data = ?, sort_order = ?, updated_at = ? WHERE id = ?`,
    [next.slug, JSON.stringify(next), next.order, nowMs(), id],
  );
  return next;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const current = await getCategoryById(id);
  if (!current) return false;
  await d1Exec("DELETE FROM categories WHERE id = ?", [id]);
  return true;
}

function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
