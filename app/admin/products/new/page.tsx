import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/admin/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const categories = await listCategories();
  return <ProductForm categories={categories} />;
}
