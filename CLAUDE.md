# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

`UMBAKES_Claude_Website_Prompt.md` is the full product spec and the source of truth. `README.md` covers setup, deployment and the launch checklist.

## Commands

- Dev: `docker compose up -d` (Postgres on :5436), then `npm run dev`. Admin is at `/admin`, with credentials from `.env`.
- Checks: `npm run lint`, `npm run typecheck`, `npm test` (Node test runner via tsx). Single file: `npx tsx --test src/lib/whatsapp.test.ts`.
- E2E: `npm run test:e2e` drives installed Edge or Chrome through playwright-core against a running server. It cleans up its own `E2E …` data.
- DB: `npm run db:migrate` (dev), `npm run db:deploy` (prod), `npm run db:seed` (idempotent; `SEED_SAMPLES=false` skips the `[Sample]` items).
- After editing `prisma/schema.prisma`, run `npm run db:migrate`. The client is generated into `src/generated/prisma`, which is gitignored; import from `@/generated/prisma/client`.

## Architecture

- **Prisma 7** uses the `prisma-client` generator and requires a driver adapter (`PrismaPg` in `src/lib/db.ts`). Config lives in `prisma.config.ts`.
- **Everything renders dynamically.** The root layout sets `dynamic = "force-dynamic"`, and all content is admin-edited in the DB. Admin actions call `refreshSite()` (`revalidatePath("/", "layout")`). Don't add static caching without a revalidation plan.
- **Data access:** `src/lib/data.ts` turns DB rows into serializable card DTOs and builds each item's `waHref` on the server. Client components never see the WhatsApp number except in the custom-cake form.
- **WhatsApp:** every link comes from `src/lib/whatsapp.ts` (`waLink`, `orderMessage`, `inquiryMessage`), which has unit tests. Order messages must keep the name, category, ref, absolute URL (`SITE_URL`) and price. The number comes only from `WebsiteSettings`.
- **Media:** `src/lib/media.ts` handles `saveUpload` (sharp decode → resize → WebP → random name under `UPLOAD_DIR`) and `deleteMediaIfUnused`. Every FK to `MediaAsset` is `onDelete: Restrict`, so the delete fails while an asset is still in use, and that is the in-use check. Files are served by `src/app/uploads/[...path]/route.ts`, not from `public/`, because runtime files in `public/` aren't served after a build. Form-level image handling is in `src/lib/admin-images.ts`. Upload the new image, save the record, then call `cleanup()` for the old one.
- **Admin:** `src/app/admin/(panel)/*` has a `page.tsx` and an `actions.ts` per entity. Every exported action must call `requireAdmin()` first. `src/proxy.ts` is only an optimistic cookie gate. Forms use `ActionForm` from `src/components/admin/forms.tsx`, which submits via `onSubmit` and `startTransition` on purpose: React's auto-reset of action-prop forms would wipe input on validation errors. Actions return `ActionState`. Use `parseForm` and the `zf` helpers from `src/lib/admin.ts`.
- **Image form fields hold client state** (`ImageField`, `ImagesField`). Give them a `key` derived from the current image ids so they remount after a save.
- **Homepage:** `HomepageSection` rows (keyed `hero`, `featuredCakes`, …) are rendered in `sortOrder` by `src/app/(site)/page.tsx`, using components in `src/components/site/HomeSections.tsx`. `CONFIG` in `src/app/admin/(panel)/homepage/page.tsx` defines which fields each section exposes.
- **Theme:** tokens live in `src/app/globals.css` (`@theme inline`). Brand and accent colours can be overridden from settings through CSS variables on `<body>`. Custom classes (`btn-primary`, `card`, `container-x`, …) are Tailwind v4 `@utility` blocks, not `@layer components`, because v4 can't `@apply` those.
- **Next 16 specifics:** `params`, `searchParams` and `cookies()` are async. Middleware is now `proxy.ts`. Use the typed `PageProps<"/route">` helpers. Read `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Hard rules from the spec

- Never invent business facts: phone numbers, addresses, hours, prices, reviews, awards, or years of experience. Leave them configurable or unpublished until the owner supplies them. Label seed data clearly as sample data.
- The brand identity (logo, colours, photography) must come from the UMBAKES Instagram (`instagram.com/umbakes_`). If those assets aren't reachable, ask for them rather than substituting stock images.
- Never fake a live Instagram feed. Use an authorized integration or an admin-managed set of images.
- Design mobile-first, respect reduced motion, and make dialogs accessible (Escape key and focus trap).
