import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { ClientForm } from "@/components/admin/ClientForm";

export const dynamic = "force-dynamic";

export default async function AdminClientNewPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  return <ClientForm />;
}
