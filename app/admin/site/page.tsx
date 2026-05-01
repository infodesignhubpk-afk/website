import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSiteSettings } from "@/lib/admin/site";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const settings = await getSiteSettings();
  return <SiteSettingsForm settings={settings} />;
}
