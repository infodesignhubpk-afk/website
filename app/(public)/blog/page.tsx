import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { listPublishedPosts } from "@/lib/admin/blogs";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: "Blog | Design Hub Peshawar",
  description:
    "Practical guides, pricing breakdowns and how-tos on branding, printing, signage and digital marketing in Peshawar — written by the Design Hub studio.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const blogPosts = await listPublishedPosts();
  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Blog</h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
              Plain-language guides on what design, print and signage actually cost in Peshawar — and what to look for before commissioning a project.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block h-full overflow-hidden rounded-2xl border border-line bg-bg transition-all hover:-translate-y-1">
                  <div className="aspect-[16/10] bg-surface p-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">{p.date} · {p.readingMinutes} min read</p>
                    <p className="mt-4 text-2xl font-bold tracking-tight">{p.title}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-ink-soft">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                      Read more
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCTA />

      <JsonLd
        id="blog-index-jsonld"
        data={breadcrumbList([{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }])}
      />
    </>
  );
}
