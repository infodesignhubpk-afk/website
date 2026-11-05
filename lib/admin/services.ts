import "server-only";
import { cache } from "react";
import { services as seedServices } from "@/data/services";
import { d1All, d1Configured, d1Exec, nowMs } from "@/lib/db";
import { newId, slugify } from "@/lib/store";
import type { AdminService } from "@/types/admin";
import type { Service, ServiceCategory } from "@/types";

type ServiceRow = {
  id: string;
  slug: string;
  data: string;
  category: string;
  sort_order: number;
  published: number;
  created_at: number;
  updated_at: number;
};

const COLUMNS = "id, slug, data, category, sort_order, published, created_at, updated_at";

// Every service URL ends in -peshawar (local SEO convention).
const SLUG_SUFFIX = "-peshawar";

function seedToAdminService(seed: Service, index: number): AdminService {
  return {
    ...seed,
    id: newId("svc"),
    published: true,
    order: index + 1,
  };
}

function rowToService(row: ServiceRow): AdminService {
  const parsed = JSON.parse(row.data) as AdminService;
  return {
    ...parsed,
    id: row.id,
    slug: row.slug,
    category: row.category as ServiceCategory,
    order: row.sort_order,
    published: row.published === 1,
  };
}

let tableEnsured = false;
async function ensureTable(): Promise<void> {
  if (tableEnsured || !d1Configured) return;
  try {
    await d1Exec(
      `CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        data TEXT NOT NULL,
        category TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        published INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
    );
    await d1Exec("CREATE INDEX IF NOT EXISTS idx_services_published ON services(published)");
    await d1Exec("CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order)");
    tableEnsured = true;
  } catch (err) {
    console.warn("[services] ensureTable failed:", err);
  }
}

let seeded = false;
async function ensureSeed(): Promise<void> {
  if (seeded || !d1Configured) return;
  await ensureTable();
  try {
    const rows = await d1All<{ count: number }>("SELECT COUNT(*) AS count FROM services");
    if ((rows[0]?.count ?? 0) > 0) {
      seeded = true;
      return;
    }

    const now = nowMs();
    for (const [i, seed] of seedServices.entries()) {
      const item = seedToAdminService(seed, i);
      // OR IGNORE + UNIQUE(slug) keeps two cold starts from double-seeding.
      await d1Exec(
        `INSERT OR IGNORE INTO services (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.id, item.slug, JSON.stringify(item), item.category, item.order, 1, now, now],
      );
    }
    seeded = true;
  } catch (err) {
    console.warn("[services] seed failed:", err);
  }
}

function fallbackServices(): AdminService[] {
  return seedServices.map(seedToAdminService);
}

export async function listServices(): Promise<AdminService[]> {
  if (!d1Configured) return fallbackServices();
  await ensureSeed();
  try {
    const rows = await d1All<ServiceRow>(
      `SELECT ${COLUMNS} FROM services ORDER BY sort_order ASC, created_at ASC`,
    );
    return rows.map(rowToService);
  } catch (err) {
    console.warn("[services] list failed:", err);
    return [];
  }
}

// Cached per request: footer, services grid and related services share one D1 read.
export const listPublishedServices = cache(async (): Promise<AdminService[]> => {
  if (!d1Configured) return fallbackServices();
  await ensureSeed();
  try {
    const rows = await d1All<ServiceRow>(
      `SELECT ${COLUMNS} FROM services WHERE published = 1 ORDER BY sort_order ASC, created_at ASC`,
    );
    return rows.map(rowToService);
  } catch (err) {
    // Service pages are the main lead source, so a D1 outage serves the
    // bundled copy rather than 404ing every /services/* URL.
    console.warn("[services] listPublished failed, serving seed data:", err);
    return fallbackServices();
  }
});

export async function getServiceBySlug(slug: string): Promise<AdminService | null> {
  const all = await listPublishedServices();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getRelatedServices(slugs: string[]): Promise<AdminService[]> {
  const all = await listPublishedServices();
  return slugs
    .map((slug) => all.find((s) => s.slug === slug))
    .filter((s): s is AdminService => Boolean(s));
}

export async function getServiceById(id: string): Promise<AdminService | null> {
  if (!d1Configured) return null;
  await ensureSeed();
  const rows = await d1All<ServiceRow>(`SELECT ${COLUMNS} FROM services WHERE id = ?`, [id]);
  return rows[0] ? rowToService(rows[0]) : null;
}

export async function createService(
  input: Omit<AdminService, "id" | "slug"> & { slug?: string },
): Promise<AdminService> {
  await ensureTable();
  const all = await listServices();
  const slug = uniqueSlug(serviceSlug(input.slug?.trim() || input.keyword), all.map((s) => s.slug));
  const id = newId("svc");
  const item: AdminService = {
    ...input,
    slug,
    id,
    relatedSlugs: input.relatedSlugs.filter((r) => r !== slug),
  };
  const now = nowMs();
  await d1Exec(
    `INSERT INTO services (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, slug, JSON.stringify(item), item.category, item.order, item.published ? 1 : 0, now, now],
  );
  return item;
}

export async function updateService(
  id: string,
  input: Partial<Omit<AdminService, "id">>,
): Promise<AdminService | null> {
  await ensureTable();
  const current = await getServiceById(id);
  if (!current) return null;
  const next: AdminService = { ...current, ...input, id, slug: current.slug };
  if (input.slug && input.slug !== current.slug) {
    const all = await listServices();
    next.slug = uniqueSlug(serviceSlug(input.slug), all.filter((s) => s.id !== id).map((s) => s.slug));
  }
  next.relatedSlugs = next.relatedSlugs.filter((r) => r !== next.slug);
  await d1Exec(
    `UPDATE services SET slug = ?, data = ?, category = ?, sort_order = ?, published = ?, updated_at = ? WHERE id = ?`,
    [next.slug, JSON.stringify(next), next.category, next.order, next.published ? 1 : 0, nowMs(), id],
  );
  return next;
}

export async function deleteService(id: string): Promise<boolean> {
  await ensureTable();
  const current = await getServiceById(id);
  if (!current) return false;
  await d1Exec("DELETE FROM services WHERE id = ?", [id]);
  return true;
}

function serviceSlug(input: string): string {
  const base = slugify(input).replace(/-?peshawar$/, "").replace(/-+$/, "");
  return `${base || "service"}${SLUG_SUFFIX}`;
}

// Numbered before the suffix so duplicates still end in -peshawar: signage-2-peshawar.
function uniqueSlug(slug: string, existing: string[]): string {
  if (!existing.includes(slug)) return slug;
  const base = slug.slice(0, -SLUG_SUFFIX.length);
  let i = 2;
  while (existing.includes(`${base}-${i}${SLUG_SUFFIX}`)) i++;
  return `${base}-${i}${SLUG_SUFFIX}`;
}
