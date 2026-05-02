import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getClientById } from "@/lib/admin/clients";
import { ClientForm } from "@/components/admin/ClientForm";

export const dynamic = "force-dynamic";

export default async function AdminClientEditPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();
  return <ClientForm client={client} />;
}
