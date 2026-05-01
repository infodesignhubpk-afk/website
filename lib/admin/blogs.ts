import "server-only";
import { readJson, writeJson, newId, slugify } from "@/lib/store";
import { blogPosts as seedPosts } from "@/data/blog";
import type { AdminBlogPost } from "@/types/admin";

const FILE = "blogs.json";

let _seeded = false;
async function ensureSeed(): Promise<AdminBlogPost[]> {
  const existing = await readJson<AdminBlogPost[] | null>(FILE, null);
  if (existing && existing.length) {
    _seeded = true;
    return existing;
  }
  if (_seeded) return [];
  const seeded: AdminBlogPost[] = seedPosts.map((p) => ({
    id: newId("blog"),
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    author: p.author,
    readingMinutes: p.readingMinutes,
    body: p.body,
    image: p.image,
    published: true,
  }));
  await writeJson(FILE, seeded);
  _seeded = true;
  return seeded;
}

export async function listBlogPosts(): Promise<AdminBlogPost[]> {
  const posts = await ensureSeed();
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function listPublishedPosts(): Promise<AdminBlogPost[]> {
  return (await listBlogPosts()).filter((p) => p.published);
}

export async function getBlogPostById(id: string): Promise<AdminBlogPost | null> {
  const all = await listBlogPosts();
  return all.find((p) => p.id === id) ?? null;
}

export async function getBlogPostBySlug(slug: string): Promise<AdminBlogPost | null> {
  const all = await listBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function createBlogPost(input: Omit<AdminBlogPost, "id" | "slug"> & { slug?: string }): Promise<AdminBlogPost> {
  const all = await listBlogPosts();
  const baseSlug = input.slug?.trim() || slugify(input.title);
  const slug = uniqueSlug(baseSlug, all.map((p) => p.slug));
  const post: AdminBlogPost = { ...input, slug, id: newId("blog") };
  await writeJson(FILE, [post, ...all]);
  return post;
}

export async function updateBlogPost(id: string, input: Partial<Omit<AdminBlogPost, "id">>): Promise<AdminBlogPost | null> {
  const all = await listBlogPosts();
  const i = all.findIndex((p) => p.id === id);
  if (i < 0) return null;
  const next: AdminBlogPost = { ...all[i], ...input, id };
  if (input.slug) {
    next.slug = uniqueSlug(slugify(input.slug), all.filter((p) => p.id !== id).map((p) => p.slug));
  }
  const all2 = [...all];
  all2[i] = next;
  await writeJson(FILE, all2);
  return next;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const all = await listBlogPosts();
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
