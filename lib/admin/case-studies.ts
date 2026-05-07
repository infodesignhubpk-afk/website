import "server-only";
import { caseStudies as seedCaseStudies } from "@/data/case-studies";
import { d1All, d1Configured, d1Exec, nowMs } from "@/lib/db";
import { newId, slugify } from "@/lib/store";
import type { AdminCaseStudy } from "@/types/admin";
import type { ServiceCategory } from "@/types";

type CaseStudyRow = {
  id: string;
  slug: string;
  data: string;
  category: string;
  client: string;
  published: number;
  created_at: number;
  updated_at: number;
};

function seedToAdminCaseStudy(seed: (typeof seedCaseStudies)[number]): AdminCaseStudy {
  return {
    ...seed,
    id: newId("case"),
    published: true,
  };
}

function rowToCaseStudy(row: CaseStudyRow): AdminCaseStudy {
  const parsed = JSON.parse(row.data) as AdminCaseStudy;
  return {
    ...parsed,
    id: row.id,
    slug: row.slug,
    category: row.category as ServiceCategory,
    client: row.client,
    published: row.published === 1,
  };
}

let tableEnsured = false;
async function ensureTable(): Promise<void> {
  if (tableEnsured || !d1Configured) return;
  try {
    await d1Exec(
      `CREATE TABLE IF NOT EXISTS case_studies (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        data TEXT NOT NULL,
        category TEXT NOT NULL,
        client TEXT NOT NULL,
        published INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
    );
    await d1Exec("CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(published)");
    await d1Exec("CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category)");
    await d1Exec("CREATE INDEX IF NOT EXISTS idx_case_studies_client ON case_studies(client)");
    tableEnsured = true;
  } catch (err) {
    console.warn("[case-studies] ensureTable failed:", err);
  }
}

let seeded = false;
async function ensureSeed(): Promise<void> {
  if (seeded || !d1Configured) return;
  await ensureTable();
  try {
    const rows = await d1All<{ count: number }>("SELECT COUNT(*) AS count FROM case_studies");
    if ((rows[0]?.count ?? 0) > 0) {
      seeded = true;
      return;
    }

    const now = nowMs();
    for (const seed of seedCaseStudies) {
      const item = seedToAdminCaseStudy(seed);
      await d1Exec(
        `INSERT OR IGNORE INTO case_studies (id, slug, data, category, client, published, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.id, item.slug, JSON.stringify(item), item.category, item.client, 1, now, now],
      );
    }
    seeded = true;
  } catch (err) {
    console.warn("[case-studies] seed failed:", err);
  }
}

function fallbackCaseStudies(): AdminCaseStudy[] {
  return seedCaseStudies.map(seedToAdminCaseStudy);
}

export async function listCaseStudies(): Promise<AdminCaseStudy[]> {
  if (!d1Configured) return fallbackCaseStudies();
  await ensureSeed();
  try {
    const rows = await d1All<CaseStudyRow>(
      "SELECT id, slug, data, category, client, published, created_at, updated_at FROM case_studies ORDER BY created_at DESC",
    );
    return rows.map(rowToCaseStudy);
  } catch (err) {
    console.warn("[case-studies] list failed:", err);
    return [];
  }
}

export async function listPublishedCaseStudies(): Promise<AdminCaseStudy[]> {
  if (!d1Configured) return fallbackCaseStudies();
  await ensureSeed();
  try {
    const rows = await d1All<CaseStudyRow>(
      "SELECT id, slug, data, category, client, published, created_at, updated_at FROM case_studies WHERE published = 1 ORDER BY created_at DESC",
    );
    return rows.map(rowToCaseStudy);
  } catch (err) {
    console.warn("[case-studies] listPublished failed:", err);
    return [];
  }
}

export async function getCaseStudyById(id: string): Promise<AdminCaseStudy | null> {
  if (!d1Configured) return null;
  await ensureSeed();
  const rows = await d1All<CaseStudyRow>(
    "SELECT id, slug, data, category, client, published, created_at, updated_at FROM case_studies WHERE id = ?",
    [id],
  );
  return rows[0] ? rowToCaseStudy(rows[0]) : null;
}

export async function getCaseStudyBySlug(slug: string): Promise<AdminCaseStudy | null> {
  if (!d1Configured) {
    return fallbackCaseStudies().find((c) => c.slug === slug && c.published) ?? null;
  }
  await ensureSeed();
  const rows = await d1All<CaseStudyRow>(
    "SELECT id, slug, data, category, client, published, created_at, updated_at FROM case_studies WHERE slug = ? AND published = 1",
    [slug],
  );
  return rows[0] ? rowToCaseStudy(rows[0]) : null;
}

export async function createCaseStudy(
  input: Omit<AdminCaseStudy, "id" | "slug"> & { slug?: string },
): Promise<AdminCaseStudy> {
  await ensureTable();
  const all = await listCaseStudies();
  const baseSlug = input.slug?.trim() || slugify(input.client || input.title);
  const slug = uniqueSlug(baseSlug, all.map((c) => c.slug));
  const id = newId("case");
  const item: AdminCaseStudy = { ...input, slug, id };
  const now = nowMs();
  await d1Exec(
    `INSERT INTO case_studies (id, slug, data, category, client, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, slug, JSON.stringify(item), item.category, item.client, item.published ? 1 : 0, now, now],
  );
  return item;
}

export async function updateCaseStudy(
  id: string,
  input: Partial<Omit<AdminCaseStudy, "id">>,
): Promise<AdminCaseStudy | null> {
  await ensureTable();
  const current = await getCaseStudyById(id);
  if (!current) return null;
  const next: AdminCaseStudy = { ...current, ...input, id };
  if (input.slug) {
    const all = await listCaseStudies();
    next.slug = uniqueSlug(slugify(input.slug), all.filter((c) => c.id !== id).map((c) => c.slug));
  }
  await d1Exec(
    `UPDATE case_studies SET slug = ?, data = ?, category = ?, client = ?, published = ?, updated_at = ? WHERE id = ?`,
    [next.slug, JSON.stringify(next), next.category, next.client, next.published ? 1 : 0, nowMs(), id],
  );
  return next;
}

export async function deleteCaseStudy(id: string): Promise<boolean> {
  await ensureTable();
  const current = await getCaseStudyById(id);
  if (!current) return false;
  await d1Exec("DELETE FROM case_studies WHERE id = ?", [id]);
  return true;
}

function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
