import "server-only";
import { d1All, d1Exec, d1Configured, nowMs } from "@/lib/db";
import { newId, slugify } from "@/lib/store";
import type { AdminPortfolioItem } from "@/types/admin";
import type { ServiceCategory } from "@/types";

type PortfolioRow = {
  id: string;
  slug: string;
  data: string;
  category: string;
  year: number;
  published: number;
};

let tableEnsured = false;

async function ensureTable(): Promise<void> {
  if (tableEnsured || !d1Configured) return;
  try {
    await d1Exec(
      `CREATE TABLE IF NOT EXISTS portfolio_items (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        data TEXT NOT NULL,
        category TEXT NOT NULL,
        year INTEGER NOT NULL,
        published INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
    );
    await d1Exec("CREATE INDEX IF NOT EXISTS idx_portfolio_published ON portfolio_items(published)");
    await d1Exec("CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items(category)");
    await d1Exec("CREATE INDEX IF NOT EXISTS idx_portfolio_year ON portfolio_items(year)");
    tableEnsured = true;
  } catch (err) {
    console.warn("[portfolio] ensureTable failed:", err);
  }
}

function rowToItem(row: PortfolioRow): AdminPortfolioItem {
  const parsed = JSON.parse(row.data) as AdminPortfolioItem;
  return {
    ...parsed,
    id: row.id,
    slug: row.slug,
    category: row.category as ServiceCategory,
    year: row.year,
    published: row.published === 1,
  };
}

export async function listPortfolio(): Promise<AdminPortfolioItem[]> {
  if (!d1Configured) return [];
  await ensureTable();
  try {
    const rows = await d1All<PortfolioRow>(
      "SELECT id, slug, data, category, year, published FROM portfolio_items ORDER BY year DESC, created_at DESC",
    );
    return rows.map(rowToItem);
  } catch (err) {
    console.warn("[portfolio] list failed:", err);
    return [];
  }
}

export async function listPublishedPortfolio(): Promise<AdminPortfolioItem[]> {
  if (!d1Configured) return [];
  await ensureTable();
  try {
    const rows = await d1All<PortfolioRow>(
      "SELECT id, slug, data, category, year, published FROM portfolio_items WHERE published = 1 ORDER BY year DESC, created_at DESC",
    );
    return rows.map(rowToItem);
  } catch (err) {
    console.warn("[portfolio] listPublished failed:", err);
    return [];
  }
}

export async function getPortfolioItemById(id: string): Promise<AdminPortfolioItem | null> {
  if (!d1Configured) return null;
  await ensureTable();
  const rows = await d1All<PortfolioRow>(
    "SELECT id, slug, data, category, year, published FROM portfolio_items WHERE id = ?",
    [id],
  );
  return rows[0] ? rowToItem(rows[0]) : null;
}

export async function getPortfolioItemBySlug(slug: string): Promise<AdminPortfolioItem | null> {
  if (!d1Configured) return null;
  await ensureTable();
  const rows = await d1All<PortfolioRow>(
    "SELECT id, slug, data, category, year, published FROM portfolio_items WHERE slug = ?",
    [slug],
  );
  return rows[0] ? rowToItem(rows[0]) : null;
}

export async function createPortfolioItem(
  input: Omit<AdminPortfolioItem, "id" | "slug"> & { slug?: string },
): Promise<AdminPortfolioItem> {
  await ensureTable();
  const all = await listPortfolio();
  const baseSlug = input.slug?.trim() || slugify(input.title);
  const slug = uniqueSlug(baseSlug, all.map((p) => p.slug));
  const id = newId("port");
  const item: AdminPortfolioItem = { ...input, slug, id };
  const now = nowMs();
  await d1Exec(
    `INSERT INTO portfolio_items (id, slug, data, category, year, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, slug, JSON.stringify(item), item.category, item.year, item.published ? 1 : 0, now, now],
  );
  return item;
}

export async function updatePortfolioItem(
  id: string,
  input: Partial<Omit<AdminPortfolioItem, "id">>,
): Promise<AdminPortfolioItem | null> {
  await ensureTable();
  const current = await getPortfolioItemById(id);
  if (!current) return null;
  const next: AdminPortfolioItem = { ...current, ...input, id };
  if (input.slug) {
    const all = await listPortfolio();
    next.slug = uniqueSlug(slugify(input.slug), all.filter((p) => p.id !== id).map((p) => p.slug));
  }
  await d1Exec(
    `UPDATE portfolio_items SET slug = ?, data = ?, category = ?, year = ?, published = ?, updated_at = ? WHERE id = ?`,
    [next.slug, JSON.stringify(next), next.category, next.year, next.published ? 1 : 0, nowMs(), id],
  );
  return next;
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  await ensureTable();
  const current = await getPortfolioItemById(id);
  if (!current) return false;
  await d1Exec("DELETE FROM portfolio_items WHERE id = ?", [id]);
  return true;
}

function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
