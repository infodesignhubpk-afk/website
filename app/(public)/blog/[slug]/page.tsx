import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { listBlogPosts, getBlogPostBySlug } from "@/lib/admin/blogs";
import { buildMetadata } from "@/lib/seo";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import { getSite } from "@/lib/admin/site";
import { absoluteUrl } from "@/lib/utils";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const all = await listBlogPosts();
  return all.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) return {};
  return buildMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) notFound();

  const site = await getSite();
  const all = await listBlogPosts();
  const others = all.filter((p) => p.published && p.slug !== post.slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: absoluteUrl(site.url, `/blog/${post.slug}`),
  };

  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: post.title, href: `/blog/${post.slug}` },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {post.date} · {post.readingMinutes} min read · {post.author}
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">{post.excerpt}</p>
          </div>
        </Container>
      </Section>

      <Section surface="white">
        <Container className="max-w-3xl">
          <article className="space-y-5 text-base md:text-lg leading-relaxed text-ink">
            {post.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
        </Container>
      </Section>

      {others.length > 0 ? (
        <Section surface="alt">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">More from the studio</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group block h-full rounded-2xl border border-line bg-bg p-6 transition-all hover:-translate-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">{p.date}</p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-sm text-ink-soft">{p.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <FinalCTA />

      <JsonLd
        id={`blog-post-${post.slug}-jsonld`}
        data={[
          articleSchema,
          breadcrumbList([
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: post.title, href: `/blog/${post.slug}` },
          ]),
        ]}
      />
    </>
  );
}

export const dynamicParams = false;
