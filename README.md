# Design Hub — Lead-generation site + admin

Next.js 16 (App Router, TypeScript strict, Tailwind v4) site for **Design Hub**, a branding, printing, signage and digital marketing agency in Peshawar, Pakistan.

This repo ships:

- A 30+ page lead-gen marketing site (10 service pages, portfolio, case studies, blog, products, contact, /get-quote, 404, etc.)
- A passcode-protected admin panel at `/admin` for editing site/SEO settings, blogs, products, categories and orders
- Cloudflare R2 storage for media uploads with copy-URL, delete and folder-grouped management
- LocalBusiness / Organization / Service / Product / FAQPage / BreadcrumbList / BlogPosting JSON-LD baked into the relevant pages
- React Hook Form + Zod forms with honeypot anti-spam, posting to `/api/lead` and `/api/orders`

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Server Components by default)
- **Language:** TypeScript strict, no `any`
- **Styling:** Tailwind CSS v4 with CSS-first `@theme` config
- **Forms:** React Hook Form + Zod
- **Storage:** Cloudflare R2 via `@aws-sdk/client-s3` (S3-compatible)
- **Persistence (admin-managed content):** JSON files in `data-store/` (drop in any Postgres/SQLite for production scale)
- **Fonts:** `next/font/google` — Jost (Century Gothic substitute) + Montserrat (Gotham substitute)

## Quick start

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

Open <http://localhost:3000>. The admin panel is at <http://localhost:3000/admin>.

```bash
pnpm build        # production build (ensures TS + RSC compile)
pnpm start        # serve the production build
pnpm lint         # ESLint
```

## Environment variables

See `.env.example` for the full list. Required:

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap and JSON-LD |
| `NEXT_PUBLIC_PHONE` | International phone (`+92...`) used in tel: links |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, e.g. `923001234567` |
| `NEXT_PUBLIC_EMAIL` | Public contact email |
| `ADMIN_PASSCODE` | Passcode for `/admin` login |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | Cloudflare R2 credentials for media uploads |
| `R2_PUBLIC_BASE_URL` | Public URL base for R2 objects (R2 dev URL or your custom domain) |

Optional:

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (G-XXXXXXXXXX) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Search Console verification meta value |
| `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_SECRET` | Forward incoming leads to Zapier / Make / n8n / your CRM |

`.env.local` is gitignored. **Do not commit production secrets.** The R2 keys you've used during local development should be rotated in the Cloudflare dashboard before going live.

## Admin panel

Browse to `/admin` and enter the passcode set in `ADMIN_PASSCODE` (a per-session HMAC-signed cookie keeps you logged in for 7 days).

Sections:

- **Dashboard** — stats and recent activity
- **Site Settings** — business name, contact, address, geo, social links, **logo and favicon** (uploaded to R2). Changes flow into the header, footer, contact page, JSON-LD and metadata.
- **SEO Settings** — default title/description, OG image, GSC verification, GA4 ID, keywords
- **Blogs** — CRUD for blog posts with cover image, draft/publish toggle, custom slug, meta title/description
- **Products** — CRUD with multi-image gallery (R2-uploaded), categories, features, stock toggle, slug, meta
- **Categories** — group products on the storefront
- **Orders** — captured from `/products/[slug]` order forms; status workflow (new → in_progress → fulfilled / cancelled)
- **Media** — R2 manager: browse the bucket, upload, copy URL, open, delete, with folder grouping and search

All admin writes are protected by the same passcode auth and stored in `data-store/*.json`. To use a database in production, replace the read/write helpers in `lib/admin/*.ts` with your DB driver of choice — the pages and forms call the same helper API.

## Cloudflare R2 setup

1. Create a bucket in the Cloudflare R2 dashboard.
2. Create an API token (Manage → API Tokens) with **Object Read & Write** scope on the bucket.
3. Enable **Public access** for the bucket (or attach a custom domain). This produces a base URL like `https://pub-<id>.r2.dev`.
4. Drop the credentials into `.env.local`.

The Media admin uploads images directly to R2 from the browser via `/api/admin/upload`. Uploaded URLs are copied via the **Copy URL** button and saved to product/blog/site records.

## Lead and order capture

- `/api/lead` — receives contact, service inquiry and quote form submissions. Validated with Zod, honeypot field rejects bots, optionally forwards to `LEAD_WEBHOOK_URL`.
- `/api/orders` — receives product order requests. Persisted to `data-store/orders.json` and visible in `/admin/orders`. Optionally forwarded to the same webhook with `kind: "order"`.

## SEO

- `app/sitemap.ts` — generates `/sitemap.xml` from services + portfolio + case studies + admin-managed products and blog posts
- `app/robots.ts` — generates `/robots.txt`
- `lib/schema.ts` + `components/seo/JsonLd.tsx` — typed JSON-LD builders rendered server-side
- Every page exports `generateMetadata` via `lib/seo.ts`
- Service pages emit Service + BreadcrumbList + FAQPage; blog posts emit BlogPosting; products emit Product
- All internal links use `next/link`, all images use `next/image`

## Routes

```
/                              Home
/about                         About
/services                      Services index
/services/[slug]               Dynamic service page (10 outputs, all -peshawar suffixed)
/portfolio                     Filterable portfolio
/portfolio/[slug]              Project detail
/case-studies                  Case study index
/case-studies/[slug]           Case study detail
/blog                          Blog index (admin-managed)
/blog/[slug]                   Blog post (admin-managed)
/products                      Storefront (admin-managed, category-filterable)
/products/[slug]               Product detail with reserve form
/contact                       Contact + map embed
/get-quote                     3-step quote form
/api/lead                      POST contact / inquiry / quote leads
/api/orders                    POST product orders
/admin                         Admin login / dashboard
/admin/site                    Site settings
/admin/seo                     SEO settings
/admin/blogs                   Blog CRUD
/admin/products                Product CRUD
/admin/categories              Category CRUD
/admin/orders                  Order management
/admin/media                   R2 media manager
```

## Conventions

See `CLAUDE.md` for the full conventions reference (design tokens, typography, file rules, SEO contract, conversion features). The short version:

- Server Components by default; `"use client"` only for forms, accordions, sticky bars
- All design tokens live in `app/globals.css` `@theme` block — never use raw colours
- Orange `#f5a732` is for primary CTAs only; green `#a2d45e` is for accents (never buttons)
- Mobile-first; design at 375px first
- All service slugs end in `-peshawar`

## Deploy

1. Push to GitHub
2. Import on Vercel (or any Node host)
3. Add the environment variables in the host's project settings
4. Cloudflare R2 works the same in production — just ensure the public URL base is reachable

## Known production caveats

- `data-store/*.json` works on local dev and a single-node host but is not safe for serverless/multi-instance deploys. For production scale, swap the helpers in `lib/admin/*.ts` to use a real database (Postgres via Drizzle/Prisma, or KV/D1). The page/form layer doesn't need to change.
- The Cloudflare R2 credentials in `.env.local` should be rotated to fresh tokens before going live.
