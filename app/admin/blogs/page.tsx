import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listBlogPosts } from "@/lib/admin/blogs";
import { AdminButton, PageTitle } from "@/components/admin/AdminUI";
import { BlogRowActions } from "@/components/admin/BlogRowActions";
import { PlusIcon, ExternalIcon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const posts = await listBlogPosts();
  return (
    <div className="space-y-8">
      <PageTitle
        title="Blogs"
        description="Manage blog posts shown on /blog. Drafts stay hidden until published."
        actions={
          <Link href="/admin/blogs/new">
            <AdminButton variant="primary"><PlusIcon size={16} /> New post</AdminButton>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-bg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface">
            <tr>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Slug</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-4">
                  <p className="font-semibold">{p.title}</p>
                  <p className="mt-0.5 text-xs text-muted line-clamp-1">{p.excerpt}</p>
                </td>
                <td className="px-5 py-4">
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-mono text-ink-soft hover:text-ink">
                    /{p.slug} <ExternalIcon size={12} />
                  </a>
                </td>
                <td className="px-5 py-4 text-xs text-muted">{p.date}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.published ? "bg-brand text-ink" : "bg-surface text-ink-soft"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <BlogRowActions id={p.id} />
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-muted">No blog posts. Create one to get started.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
