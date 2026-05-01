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
- **Storage:** Cloudflare R2 via `@aws-sdk/client-s3` (S3-compatible) — both media uploads and admin-managed JSON content
- **Persistence (admin-managed content):** R2 object store under the `data-store/` prefix when R2 is configured; falls back to local `data-store/*.json` files for first-time dev without R2 creds
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

All admin writes are protected by the same passcode auth. Content is stored as JSON objects in R2 under the `data-store/` prefix when R2 credentials are present (recommended for any deployment), and falls back to local `data-store/*.json` for first-time dev. To swap in a real database later, replace the helpers in `lib/admin/*.ts` with your DB driver of choice — the pages and forms call the same helper API.

## Cloudflare R2 setup

1. Create a bucket in the Cloudflare R2 dashboard.
2. Create an API token (Manage → API Tokens) with **Object Read & Write** scope on the bucket.
3. Enable **Public access** for the bucket (or attach a custom domain). This produces a base URL like `https://pub-<id>.r2.dev`.
4. Drop the credentials into `.env.local`.

The Media admin uploads images directly to R2 from the browser via `/api/admin/upload`. Uploaded URLs are copied via the **Copy URL** button and saved to product/blog/site records.

## Lead and order capture

- `/api/lead` — receives contact, service inquiry and quote form submissions. Validated with Zod, honeypot field rejects bots, optionally forwards to `LEAD_WEBHOOK_URL`.
- `/api/orders` — receives product order requests. Persisted via the R2-backed store and visible in `/admin/orders`. Optionally forwarded to the same webhook with `kind: "order"`.

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

## Deploy to Vercel

This project is configured for Vercel out of the box.

1. Push to GitHub.
2. Import the repo on Vercel (auto-detects Next.js + pnpm via `pnpm-lock.yaml`).
3. Add the environment variables from `.env.example` in **Project Settings → Environment Variables**. At minimum:
   - `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_EMAIL`
   - `ADMIN_PASSCODE`
   - All `R2_*` credentials (admin content **requires** R2 in production — Vercel's filesystem is read-only)
4. Deploy. The configured region is `bom1` (Mumbai) for Pakistan latency — change in `vercel.json` if you need another region.

What's already wired for Vercel:

- **R2-backed JSON persistence** — admin-managed content (blogs, products, categories, orders, site/SEO settings) is stored in R2 under `data-store/` so it survives across serverless invocations. The fs path is only used for local dev when R2 isn't configured.
- **`vercel.json`** — region preference + per-route `maxDuration`/`memory` tuning (the upload route gets 60s + 1024 MB).
- **Lockfile** — `pnpm-lock.yaml` only; `package-lock.json` is intentionally absent so Vercel uses pnpm.
- **`engines.node`** — `>=20.0.0`.
- **All API routes set `runtime = "nodejs"`** — required for the AWS SDK (it doesn't run on edge).
- **Admin pages set `dynamic = "force-dynamic"`** — they read live state.
- **Image remote patterns** — `next/image` allowlists R2 dev URLs, your custom R2 domain, and Cloudflare `imagedelivery.net`.
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` set globally in `next.config.ts`.

## Known caveats

- The Cloudflare R2 credentials in `.env.local` should be rotated to fresh tokens before going live.
- For high-write admin scenarios (heavy concurrent edits) the R2 JSON store is fine but eventually-consistent. Swap the helpers in `lib/admin/*.ts` to a real database (Vercel Postgres / Neon + Drizzle, or D1) if that becomes a concern. The page/form layer doesn't need to change.
