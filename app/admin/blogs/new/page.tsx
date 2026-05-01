import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  return <BlogPostForm />;
}
