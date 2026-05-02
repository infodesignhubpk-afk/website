import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioNewPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  return <PortfolioForm />;
}
