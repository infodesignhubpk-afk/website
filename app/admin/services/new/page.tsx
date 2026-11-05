import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listServices } from "@/lib/admin/services";
import { industryNames } from "@/data/industries";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const all = await listServices();
  return (
    <ServiceForm
      otherServices={all.map(({ slug, keyword }) => ({ slug, keyword }))}
      defaultIndustries={industryNames}
      nextOrder={Math.max(0, ...all.map((s) => s.order)) + 1}
    />
  );
}
