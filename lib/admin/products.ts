import "server-only";
import { readJson, writeJson, newId, slugify } from "@/lib/store";
import type { AdminProduct } from "@/types/admin";

const FILE = "products.json";

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

export async function listProducts(): Promise<AdminProduct[]> {
  const all = await readJson<AdminProduct[] | null>(FILE, null);
  if (!all) {
    await writeJson(FILE, seed);
    return seed;
  }
  return all;
}

export async function listPublishedProducts(): Promise<AdminProduct[]> {
  return (await listProducts()).filter((p) => p.published);
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  const all = await listProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<AdminProduct | null> {
  const all = await listProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function createProduct(input: Omit<AdminProduct, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string }): Promise<AdminProduct> {
  const all = await listProducts();
  const baseSlug = input.slug?.trim() || slugify(input.name);
  const slug = uniqueSlug(baseSlug, all.map((p) => p.slug));
  const now = new Date().toISOString();
  const product: AdminProduct = { ...input, slug, id: newId("prd"), createdAt: now, updatedAt: now };
  await writeJson(FILE, [product, ...all]);
  return product;
}

export async function updateProduct(id: string, input: Partial<Omit<AdminProduct, "id" | "createdAt">>): Promise<AdminProduct | null> {
  const all = await listProducts();
  const i = all.findIndex((p) => p.id === id);
  if (i < 0) return null;
  const next: AdminProduct = { ...all[i], ...input, id, updatedAt: new Date().toISOString() };
  if (input.slug) {
    next.slug = uniqueSlug(slugify(input.slug), all.filter((p) => p.id !== id).map((p) => p.slug));
  }
  const arr = [...all];
  arr[i] = next;
  await writeJson(FILE, arr);
  return next;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const all = await listProducts();
  const next = all.filter((p) => p.id !== id);
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
