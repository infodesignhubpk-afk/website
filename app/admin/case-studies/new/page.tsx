import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";

export const dynamic = "force-dynamic";

export default async function NewCaseStudyPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  return <CaseStudyForm />;
}
