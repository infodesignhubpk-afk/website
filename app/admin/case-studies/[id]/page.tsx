import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCaseStudyById } from "@/lib/admin/case-studies";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";

export const dynamic = "force-dynamic";

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { id } = await params;
  const item = await getCaseStudyById(id);
  if (!item) notFound();
  return <CaseStudyForm item={item} />;
}
