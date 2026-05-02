import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getPortfolioItemById } from "@/lib/admin/portfolio";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioEditPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { id } = await params;
  const item = await getPortfolioItemById(id);
  if (!item) notFound();
  return <PortfolioForm item={item} />;
}
