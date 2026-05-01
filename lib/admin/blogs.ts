import "server-only";
import { d1All, d1Exec, d1Configured, nowMs } from "@/lib/db";
import { newId, slugify } from "@/lib/store";
import { blogPosts as seedPosts } from "@/data/blog";
import type { AdminBlogPost } from "@/types/admin";

type BlogRow = {
  id: string;
  slug: string;
  data: string;
  published: number;
  date: string;
  created_at: number;
  updated_at: number;
};

function rowToPost(row: BlogRow): AdminBlogPost {
  const parsed = JSON.parse(row.data) as AdminBlogPost;
  return { ...parsed, id: row.id, slug: row.slug, published: row.published === 1 };
}

let _seeded = false;
async function ensureSeed(): Promise<void> {
  if (_seeded || !d1Configured) return;
  try {
    const rows = await d1All<{ count: number }>("SELECT COUNT(*) AS count FROM blogs");
    if ((rows[0]?.count ?? 0) > 0) {
      _seeded = true;
      return;
    }
    const now = nowMs();
    for (const p of seedPosts) {
      const post: AdminBlogPost = {
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
      };
      await d1Exec(
        `INSERT OR IGNORE INTO blogs (id, slug, data, published, date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [post.id, post.slug, JSON.stringify(post), 1, post.date, now, now],
      );
    }
    _seeded = true;
  } catch (err) {
    console.warn("[blogs] seed failed:", err);
  }
}

export async function listBlogPosts(): Promise<AdminBlogPost[]> {
  if (!d1Configured) return [];
  await ensureSeed();
  try {
    const rows = await d1All<BlogRow>(
      "SELECT id, slug, data, published, date, created_at, updated_at FROM blogs ORDER BY date DESC",
    );
    return rows.map(rowToPost);
  } catch (err) {
    console.warn("[blogs] list failed:", err);
    return [];
  }
}

export async function listPublishedPosts(): Promise<AdminBlogPost[]> {
  if (!d1Configured) return [];
  await ensureSeed();
  try {
    const rows = await d1All<BlogRow>(
      "SELECT id, slug, data, published, date, created_at, updated_at FROM blogs WHERE published = 1 ORDER BY date DESC",
    );
    return rows.map(rowToPost);
  } catch (err) {
    console.warn("[blogs] listPublished failed:", err);
    return [];
  }
}

export async function getBlogPostById(id: string): Promise<AdminBlogPost | null> {
  if (!d1Configured) return null;
  await ensureSeed();
  const rows = await d1All<BlogRow>(
    "SELECT id, slug, data, published, date, created_at, updated_at FROM blogs WHERE id = ?",
    [id],
  );
  return rows[0] ? rowToPost(rows[0]) : null;
}

export async function getBlogPostBySlug(slug: string): Promise<AdminBlogPost | null> {
  if (!d1Configured) return null;
  await ensureSeed();
  const rows = await d1All<BlogRow>(
    "SELECT id, slug, data, published, date, created_at, updated_at FROM blogs WHERE slug = ?",
    [slug],
  );
  return rows[0] ? rowToPost(rows[0]) : null;
}

export async function createBlogPost(
  input: Omit<AdminBlogPost, "id" | "slug"> & { slug?: string },
): Promise<AdminBlogPost> {
  const all = await listBlogPosts();
  const baseSlug = input.slug?.trim() || slugify(input.title);
  const slug = uniqueSlug(baseSlug, all.map((p) => p.slug));
  const id = newId("blog");
  const post: AdminBlogPost = { ...input, slug, id };
  const now = nowMs();
  await d1Exec(
    `INSERT INTO blogs (id, slug, data, published, date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, slug, JSON.stringify(post), post.published ? 1 : 0, post.date, now, now],
  );
  return post;
}

export async function updateBlogPost(
  id: string,
  input: Partial<Omit<AdminBlogPost, "id">>,
): Promise<AdminBlogPost | null> {
  const current = await getBlogPostById(id);
  if (!current) return null;
  const next: AdminBlogPost = { ...current, ...input, id };
  if (input.slug) {
    const all = await listBlogPosts();
    next.slug = uniqueSlug(slugify(input.slug), all.filter((p) => p.id !== id).map((p) => p.slug));
  }
  await d1Exec(
    `UPDATE blogs SET slug = ?, data = ?, published = ?, date = ?, updated_at = ? WHERE id = ?`,
    [next.slug, JSON.stringify(next), next.published ? 1 : 0, next.date, nowMs(), id],
  );
  return next;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const current = await getBlogPostById(id);
  if (!current) return false;
  await d1Exec("DELETE FROM blogs WHERE id = ?", [id]);
  return true;
}

function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
