import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProductById } from "@/lib/admin/products";
import { listCategories } from "@/lib/admin/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), listCategories()]);
  if (!product) notFound();
  return <ProductForm product={product} categories={categories} />;
}
