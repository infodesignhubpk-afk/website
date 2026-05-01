import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { services } from "@/data/services";
import { portfolio } from "@/data/portfolio";
import { caseStudies } from "@/data/case-studies";
import { listPublishedPosts } from "@/lib/admin/blogs";
import { listPublishedProducts } from "@/lib/admin/products";
import { listCategories } from "@/lib/admin/categories";
import { getSiteSettings } from "@/lib/admin/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base = (settings.url || siteConfig.url).replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/case-studies",
    "/blog",
    "/products",
    "/contact",
    "/get-quote",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const portfolioEntries: MetadataRoute.Sitemap = portfolio.map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: `${base}/case-studies/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogPosts = await listPublishedPosts();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const products = await listPublishedProducts();
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categories = await listCategories();
  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/products?category=${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...portfolioEntries,
    ...caseStudyEntries,
    ...blogEntries,
    ...productEntries,
    ...categoryEntries,
  ];
}
