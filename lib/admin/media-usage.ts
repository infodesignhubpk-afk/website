import "server-only";
import { listProducts } from "@/lib/admin/products";
import { listBlogPosts } from "@/lib/admin/blogs";
import { listCategories } from "@/lib/admin/categories";
import { getSiteSettings } from "@/lib/admin/site";
import { getSeoSettings } from "@/lib/admin/seo";

export type MediaUsageEntry = {
  count: number;
  locations: { label: string; href?: string }[];
};

export type MediaUsageMap = Record<string, MediaUsageEntry>;

function add(map: MediaUsageMap, url: string | undefined | null, label: string, href?: string) {
  if (!url) return;
  const entry = map[url] ?? { count: 0, locations: [] };
  entry.count += 1;
  entry.locations.push({ label, href });
  map[url] = entry;
}

export async function buildMediaUsage(): Promise<MediaUsageMap> {
  const usage: MediaUsageMap = {};

  const [products, blogs, categories, site, seo] = await Promise.all([
    listProducts(),
    listBlogPosts(),
    listCategories(),
    getSiteSettings(),
    getSeoSettings(),
  ]);

  for (const p of products) {
    p.images.forEach((url, i) => {
      const label = i === 0 ? `Product: ${p.name}` : `Product: ${p.name} (#${i + 1})`;
      add(usage, url, label, `/admin/products/${p.id}`);
    });
  }

  for (const b of blogs) {
    if (b.image) add(usage, b.image, `Blog: ${b.title}`, `/admin/blogs/${b.id}`);
  }

  for (const c of categories) {
    if (c.image) add(usage, c.image, `Category: ${c.name}`, `/admin/categories/${c.id}`);
  }

  add(usage, site.logoUrl, "Site logo (header)", "/admin/site");
  add(usage, site.logoWhiteUrl, "Site logo (footer)", "/admin/site");
  add(usage, site.faviconUrl, "Site favicon", "/admin/site");
  add(usage, seo.defaultOgImage, "Default OG image", "/admin/seo");

  return usage;
}
