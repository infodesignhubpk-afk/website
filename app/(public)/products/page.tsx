import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { listPublishedProducts } from "@/lib/admin/products";
import { listCategories } from "@/lib/admin/categories";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import { FinalCTA } from "@/components/home/FinalCTA";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@/components/ui/Icons";

export const metadata: Metadata = buildMetadata({
  title: "Products | Design Hub Peshawar",
  description:
    "Branded packages and printable products from Design Hub. Logo kits, business cards, illuminated signage and more — built for Peshawar businesses.",
  path: "/products",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([listPublishedProducts(), listCategories()]);
  const activeCategory = categories.find((c) => c.slug === sp.category);
  const items = activeCategory
    ? products.filter((p) => p.categoryIds.includes(activeCategory.id))
    : products;

  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Products", href: "/products" }]} />
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Products</h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-ink-soft">
              Pre-priced, ready-to-order packages from our studio and print floor. Reserve from the page; we&apos;ll confirm by phone or WhatsApp inside one working day.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="white" className="pt-0">
        <Container>
          <ul className="flex flex-wrap gap-2 border-b border-line pb-6">
            <li>
              <Link
                href="/products"
                aria-current={activeCategory ? undefined : "page"}
                className={cn(
                  "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold tracking-tight",
                  !activeCategory ? "border-ink bg-ink text-bg" : "border-line text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.slug}`}
                  aria-current={activeCategory?.slug === c.slug ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold tracking-tight",
                    activeCategory?.slug === c.slug ? "border-ink bg-ink text-bg" : "border-line text-ink-soft hover:border-ink hover:text-ink",
                  )}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] bg-surface">
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" unoptimized />
                    ) : (
                      <div className="grid h-full place-items-center p-6 text-center">
                        <span className="text-xl font-bold tracking-tight">{p.name}</span>
                      </div>
                    )}
                    {!p.inStock ? (
                      <span className="absolute right-3 top-3 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-800">Out of stock</span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h2 className="text-lg font-semibold tracking-tight">{p.name}</h2>
                    <p className="text-sm text-ink-soft">{p.shortDescription}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
                      <p className="text-base font-bold">{p.currency} {p.price.toLocaleString()}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold">
                        View <ArrowRightIcon size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {items.length === 0 ? (
              <li className="col-span-full rounded-2xl border border-dashed border-line p-12 text-center text-base text-ink-soft">
                No products in this category yet.
              </li>
            ) : null}
          </ul>
        </Container>
      </Section>

      <FinalCTA />

      <JsonLd
        id="products-jsonld"
        data={breadcrumbList([{ name: "Home", href: "/" }, { name: "Products", href: "/products" }])}
      />
    </>
  );
}
