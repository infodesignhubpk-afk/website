import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCategoryById } from "@/lib/admin/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { id } = await params;
  const cat = await getCategoryById(id);
  if (!cat) notFound();
  return <CategoryForm category={cat} />;
}
