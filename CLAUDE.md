# Design Hub — Conventions

Lead-generation website for **Design Hub**, a branding, printing, signage, and digital marketing agency in Peshawar, Pakistan.

## Stack
- Next.js 16 (App Router, Server Components by default)
- TypeScript strict (no `any`; use `unknown` and narrow)
- Tailwind CSS v4 with CSS-first `@theme` config in `app/globals.css`
- React Hook Form + Zod for every form
- `next/font/google` (Jost as Century Gothic substitute, Montserrat as Gotham substitute)
- `next/image` for every image, `next/link` for every internal link
- pnpm

## Design tokens (Tailwind via `@theme`)
- `--color-brand` `#a2d45e` — accents, hover, decorative strips. Never a button colour.
- `--color-cta` `#f5a732` — primary CTAs only. Never used for links/icons/borders.
- `--color-ink` `#000000` — body text, headings (no grey body text).
- `--color-ink-soft` `#1a1a1a` — secondary text.
- `--color-muted` `#6b6b6b` — metadata only.
- `--color-line` `#e6e6e6`, `--color-surface` `#f7f7f5`, `--color-bg` `#ffffff`.

## Typography
- Display: `var(--font-display)` (Jost) — H1/H2/H3.
- Body: `var(--font-body)` (Montserrat) — paragraphs.
- H1: `text-4xl md:text-6xl font-bold tracking-tight` (one per page).
- H2: `text-3xl md:text-5xl font-bold tracking-tight`.
- H3: `text-xl md:text-2xl font-semibold`.
- Body: `text-base md:text-lg leading-relaxed`.

## Layout
- `<Section>` wraps all top-level sections (`py-16 md:py-24 lg:py-32`).
- `<Container>` wraps content (`max-w-7xl mx-auto px-4 md:px-6 lg:px-8`).
- Mobile-first; design at 375px first.
- Cards: `rounded-2xl border border-line` (no heavy shadows).

## File rules
- `data/*.ts` is the single source of content. Pages import from there.
- One component per file, PascalCase. Named exports everywhere except `page.tsx` / `layout.tsx`.
- `"use client"` only for forms, accordions, sticky bars, WhatsApp button — anything stateful.
- All service slugs end in `-peshawar`.

## SEO contract
- Every route exports `generateMetadata` via `lib/seo.ts`.
- `lib/schema.ts` exports typed JSON-LD builders; `<JsonLd>` server component renders them.
- Root layout emits Organization, WebSite, LocalBusiness.
- Service pages emit Service + BreadcrumbList + FAQPage.
- One H1 per page; heading hierarchy never skips.

## Conversion features (every page)
- Floating WhatsApp button (all viewports).
- Mobile sticky CTA bar (`md:hidden`): Call Now + Get Quote.
- Final CTA above footer.
- Forms: honeypot field `name="website"`, Zod validation, POST to `/api/lead`.

## Phone validation
Accepts `+92...` and `03...` formats.

## Env vars (see `.env.example`)
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL`, `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET`.

## Build gates
After each phase: `pnpm build` must pass. Definition of Done: typecheck, build, lint clean; Lighthouse >= 90/95/95 on home + a service page.
