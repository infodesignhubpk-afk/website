import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  return <CategoryForm />;
}
