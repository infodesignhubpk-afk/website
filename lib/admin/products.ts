import "server-only";
import { d1All, d1Exec, d1Configured, nowMs } from "@/lib/db";
import { newId, slugify } from "@/lib/store";
import type { AdminProduct } from "@/types/admin";

type ProductRow = {
  id: string;
  slug: string;
  data: string;
  published: number;
  created_at: number;
  updated_at: number;
};

function rowToProduct(row: ProductRow): AdminProduct {
  const parsed = JSON.parse(row.data) as AdminProduct;
  return { ...parsed, id: row.id, slug: row.slug, published: row.published === 1 };
}

const seed: AdminProduct[] = [
  {
    id: "prd_seed_logo_kit",
    slug: "starter-logo-kit",
    name: "Starter Logo Kit",
    shortDescription: "Custom logo with three concept routes, two revisions and full vector files.",
    description:
      "A complete starter package for new businesses launching in Peshawar. Includes three concept routes, two rounds of revisions on the chosen route, full vector exports (AI, EPS, SVG, PDF, PNG), monochrome variants and a one-page usage guide.",
    price: 25000,
    currency: "PKR",
    categoryIds: ["cat_seed_branding"],
    images: [],
    inStock: true,
    published: true,
    features: [
      "Three concept routes",
      "Two revision rounds",
      "Vector files (AI/EPS/SVG/PDF)",
      "Monochrome variants",
      "Favicon & social profile images",
      "One-page usage guide",
    ],
    metaTitle: "Starter Logo Kit | Design Hub Peshawar",
    metaDescription: "Custom-designed logo with three concept routes, two revisions, full vector files and a usage guide. Built for Peshawar businesses.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prd_seed_business_cards",
    slug: "premium-business-cards",
    name: "Premium Business Cards",
    shortDescription: "300gsm matt-laminated cards with optional spot UV. 500-card runs.",
    description:
      "Premium 300gsm matt-laminated business cards printed on calibrated offset presses with sharp colour fidelity. Optional spot UV, foiling and rounded corners. Standard run is 500 cards in CMYK with full bleed.",
    price: 4500,
    currency: "PKR",
    categoryIds: ["cat_seed_print"],
    images: [],
    inStock: true,
    published: true,
    features: [
      "300gsm premium card stock",
      "Matt or gloss lamination",
      "Optional spot UV",
      "Both-sides full-colour print",
      "500-card standard run",
      "Free pre-press file check",
    ],
    metaTitle: "Premium Business Cards Peshawar | Design Hub",
    metaDescription: "Premium 300gsm laminated business cards printed on calibrated offset presses. Optional spot UV, foil and rounded corners.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prd_seed_acrylic_3d",
    slug: "acrylic-3d-letter-sign-3ft",
    name: "Acrylic 3D Letter Signboard (3ft)",
    shortDescription: "Front-lit 3D acrylic letter signboard up to 3 feet wide. Installed in Peshawar.",
    description:
      "Front-lit 3D acrylic letter signboard fabricated from CNC-routed cast acrylic with SMT LED illumination. Includes site survey, electrical assembly, weather-sealing and installation across Peshawar. Up to 3 feet wide.",
    price: 85000,
    currency: "PKR",
    categoryIds: ["cat_seed_signage"],
    images: [],
    inStock: true,
    published: true,
    features: [
      "CNC-routed cast acrylic",
      "SMT LED illumination",
      "Site survey + 3D mockup",
      "Installation included",
      "Weather-sealed electricals",
      "Two-year fabrication warranty",
    ],
    metaTitle: "Acrylic 3D Letter Signboard | Design Hub Peshawar",
    metaDescription: "Front-lit 3D acrylic letter signboard up to 3 feet wide with SMT LED illumination, installation and a two-year warranty.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let _seeded = false;
async function ensureSeed(): Promise<void> {
  if (_seeded || !d1Configured) return;
  try {
    const rows = await d1All<{ count: number }>("SELECT COUNT(*) AS count FROM products");
    if ((rows[0]?.count ?? 0) > 0) {
      _seeded = true;
      return;
    }
    const now = nowMs();
    for (const p of seed) {
      await d1Exec(
        `INSERT OR IGNORE INTO products (id, slug, data, published, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [p.id, p.slug, JSON.stringify(p), p.published ? 1 : 0, now, now],
      );
    }
    _seeded = true;
  } catch (err) {
    console.warn("[products] seed failed:", err);
  }
}

export async function listProducts(): Promise<AdminProduct[]> {
  if (!d1Configured) return [];
  await ensureSeed();
  try {
    const rows = await d1All<ProductRow>(
      "SELECT id, slug, data, published, created_at, updated_at FROM products ORDER BY created_at DESC",
    );
    return rows.map(rowToProduct);
  } catch (err) {
    console.warn("[products] list failed:", err);
    return [];
  }
}

export async function listPublishedProducts(): Promise<AdminProduct[]> {
  if (!d1Configured) return [];
  await ensureSeed();
  try {
    const rows = await d1All<ProductRow>(
      "SELECT id, slug, data, published, created_at, updated_at FROM products WHERE published = 1 ORDER BY created_at DESC",
    );
    return rows.map(rowToProduct);
  } catch (err) {
    console.warn("[products] listPublished failed:", err);
    return [];
  }
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  if (!d1Configured) return null;
  await ensureSeed();
  const rows = await d1All<ProductRow>(
    "SELECT id, slug, data, published, created_at, updated_at FROM products WHERE id = ?",
    [id],
  );
  return rows[0] ? rowToProduct(rows[0]) : null;
}

export async function getProductBySlug(slug: string): Promise<AdminProduct | null> {
  if (!d1Configured) return null;
  await ensureSeed();
  const rows = await d1All<ProductRow>(
    "SELECT id, slug, data, published, created_at, updated_at FROM products WHERE slug = ?",
    [slug],
  );
  return rows[0] ? rowToProduct(rows[0]) : null;
}

export async function createProduct(
  input: Omit<AdminProduct, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string },
): Promise<AdminProduct> {
  const all = await listProducts();
  const baseSlug = input.slug?.trim() || slugify(input.name);
  const slug = uniqueSlug(baseSlug, all.map((p) => p.slug));
  const nowIso = new Date().toISOString();
  const id = newId("prd");
  const product: AdminProduct = { ...input, slug, id, createdAt: nowIso, updatedAt: nowIso };
  const now = nowMs();
  await d1Exec(
    `INSERT INTO products (id, slug, data, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, slug, JSON.stringify(product), product.published ? 1 : 0, now, now],
  );
  return product;
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<AdminProduct, "id" | "createdAt">>,
): Promise<AdminProduct | null> {
  const current = await getProductById(id);
  if (!current) return null;
  const next: AdminProduct = { ...current, ...input, id, updatedAt: new Date().toISOString() };
  if (input.slug) {
    const all = await listProducts();
    next.slug = uniqueSlug(slugify(input.slug), all.filter((p) => p.id !== id).map((p) => p.slug));
  }
  await d1Exec(
    `UPDATE products SET slug = ?, data = ?, published = ?, updated_at = ? WHERE id = ?`,
    [next.slug, JSON.stringify(next), next.published ? 1 : 0, nowMs(), id],
  );
  return next;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const current = await getProductById(id);
  if (!current) return false;
  await d1Exec("DELETE FROM products WHERE id = ?", [id]);
  return true;
}

function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
