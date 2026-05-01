import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { listPublishedProducts, getProductBySlug } from "@/lib/admin/products";
import { listCategories } from "@/lib/admin/categories";
import { buildMetadata } from "@/lib/seo";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/schema";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CheckIcon } from "@/components/ui/Icons";
import { absoluteUrl } from "@/lib/utils";
import { getSite } from "@/lib/admin/site";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.published) return {};
  return buildMetadata({
    title: product.metaTitle || `${product.name} | Design Hub Peshawar`,
    description: product.metaDescription || product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.images[0],
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.published) notFound();

  const site = await getSite();
  const [categories, all] = await Promise.all([listCategories(), listPublishedProducts()]);
  const productCategories = categories.filter((c) => product.categoryIds.includes(c.id));
  const others = all.filter((p) => p.id !== product.id).slice(0, 3);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.images,
    sku: product.id,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(site.url, `/products/${product.slug}`),
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <Section surface="white" className="pt-12 pb-0 md:pt-16">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Products", href: "/products" },
              { name: product.name, href: `/products/${product.slug}` },
            ]}
          />
        </Container>
      </Section>

      <Section surface="white" className="pt-8">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <ProductGallery name={product.name} images={product.images} />
            </div>

            <div className="lg:col-span-5">
              {productCategories.length > 0 ? (
                <div className="mb-3 flex flex-wrap gap-2">
                  {productCategories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.slug}`}
                      className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft hover:border-ink"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              ) : null}
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{product.name}</h1>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-ink-soft">{product.shortDescription}</p>
              <p className="mt-6 text-3xl font-bold tracking-tight">
                {product.currency} {product.price.toLocaleString()}
              </p>
              <p className={`mt-2 text-sm font-semibold ${product.inStock ? "text-ink-soft" : "text-red-700"}`}>
                {product.inStock ? "Available · Reserve below" : "Currently out of stock"}
              </p>

              {product.features.length > 0 ? (
                <ul className="mt-8 space-y-3">
                  {product.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-ink">
                      <CheckIcon size={18} className="mt-0.5 shrink-0 text-ink" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-10">
                <AddToCartButton
                  productId={product.id}
                  productSlug={product.slug}
                  productName={product.name}
                  unitPrice={product.price}
                  currency={product.currency}
                  image={product.images[0]}
                  inStock={product.inStock}
                />
              </div>
            </div>
          </div>

          {product.description ? (
            <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="text-2xl font-semibold tracking-tight">About this product</h2>
              </div>
              <div className="lg:col-span-8">
                <p className="whitespace-pre-wrap text-base md:text-lg leading-relaxed text-ink">{product.description}</p>
              </div>
            </div>
          ) : null}
        </Container>
      </Section>

      {others.length > 0 ? (
        <Section surface="alt">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">More from Design Hub</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {others.map((p) => (
                <li key={p.id}>
                  <Link href={`/products/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg transition-all hover:-translate-y-1">
                    <div className="relative aspect-[4/3] bg-surface">
                      {p.images[0] ? (
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" unoptimized />
                      ) : (
                        <div className="grid h-full place-items-center p-6 text-center text-lg font-bold">{p.name}</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <h3 className="text-base font-semibold tracking-tight">{p.name}</h3>
                      <p className="text-sm text-ink-soft">{p.shortDescription}</p>
                      <p className="mt-auto pt-3 text-sm font-bold">{p.currency} {p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <FinalCTA />

      <JsonLd
        id={`product-${product.slug}-jsonld`}
        data={[
          productSchema,
          breadcrumbList([
            { name: "Home", href: "/" },
            { name: "Products", href: "/products" },
            { name: product.name, href: `/products/${product.slug}` },
          ]),
        ]}
      />
    </>
  );
}

function ProductGallery({ name, images }: { name: string; images: string[] }) {
  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl border border-line bg-surface">
        <div className="grid h-full place-items-center p-12 text-center">
          <span className="text-3xl font-bold tracking-tight">{name}</span>
        </div>
      </div>
    );
  }
  const [first, ...rest] = images;
  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
        <Image src={first} alt={name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" priority unoptimized />
      </div>
      {rest.length > 0 ? (
        <ul className="grid grid-cols-4 gap-3">
          {rest.slice(0, 4).map((src, i) => (
            <li key={src} className="relative aspect-square overflow-hidden rounded-xl border border-line bg-surface">
              <Image src={src} alt={`${name} image ${i + 2}`} fill className="object-cover" sizes="20vw" unoptimized />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
