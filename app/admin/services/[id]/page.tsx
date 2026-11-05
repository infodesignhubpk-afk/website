import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getServiceById, listServices } from "@/lib/admin/services";
import { industryNames } from "@/data/industries";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { id } = await params;
  const [item, all] = await Promise.all([getServiceById(id), listServices()]);
  if (!item) notFound();
  return (
    <ServiceForm
      item={item}
      otherServices={all.filter((s) => s.id !== id).map(({ slug, keyword }) => ({ slug, keyword }))}
      defaultIndustries={industryNames}
      nextOrder={item.order}
    />
  );
}
