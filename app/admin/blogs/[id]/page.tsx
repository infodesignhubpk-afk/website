import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getBlogPostById } from "@/lib/admin/blogs";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();
  return <BlogPostForm post={post} />;
}
