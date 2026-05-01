import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSeoSettings } from "@/lib/admin/seo";
import { SeoSettingsForm } from "@/components/admin/SeoSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const settings = await getSeoSettings();
  return <SeoSettingsForm settings={settings} />;
}
