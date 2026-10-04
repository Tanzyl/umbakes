# UMBAKES website

A custom-cake and bakery website with a WhatsApp ordering flow and an admin dashboard for the owner.
Built with Next.js 16, TypeScript, Tailwind CSS 4, PostgreSQL and Prisma 7.

## Local development

Requirements: Node 20+, Docker (for PostgreSQL).

```bash
docker compose up -d          # PostgreSQL on localhost:5436
cp .env.example .env          # then edit: DATABASE_URL (see docker-compose.yml), ADMIN_EMAIL, ADMIN_PASSWORD
npm install                   # also generates the Prisma client
npm run db:migrate            # apply migrations
npm run db:seed               # admin user, settings, homepage text, categories, labelled sample items
npm run dev                   # http://localhost:3000, admin at /admin
```

The seed is safe to re-run and never overwrites content edited in the admin. Set `SEED_SAMPLES=false` to skip the
sample products and reviews. Samples are named `[Sample] …`, have no prices, and the sample reviews stay unapproved.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm test` | Unit tests (`src/**/*.test.ts`, Node test runner). One file: `npx tsx --test src/lib/whatsapp.test.ts` |
| `npm run test:e2e` | Browser smoke test against a running server (`BASE_URL`, default `http://localhost:3000`). Uses the installed Edge or Chrome (`BROWSER_CHANNEL=chrome`). It creates and then deletes its own test data. |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:deploy` | Apply migrations in production |
| `npm run db:seed` | Seed (idempotent) |

## Production deployment (VPS)

1. **Database.** Use PostgreSQL 15+ and set `DATABASE_URL`.
2. **Environment.** Set `SITE_URL=https://your-domain` (used in WhatsApp reference links, the sitemap and canonical URLs),
   `UPLOAD_DIR`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Never commit `.env`.
3. **Build and start:**
   ```bash
   npm ci
   npm run build
   npm run db:deploy
   SEED_SAMPLES=false npm run db:seed   # first deploy only
   npm start                            # run under systemd or pm2 so it restarts on reboot
   ```
4. **Reverse proxy** (nginx/Caddy) with HTTPS in front of port 3000. Forward the public host
   (`proxy_set_header X-Forwarded-Host $host;`), because server actions compare it against the request origin as CSRF protection.
   Allow request bodies of at least 40 MB (`client_max_body_size 40m;`) for photo uploads.

### Uploaded images must live outside the build

Admin uploads are written to `UPLOAD_DIR` and served by the app at `/uploads/…` (see `src/app/uploads/[...path]/route.ts`).
Rebuilding or redeploying the code does **not** keep files inside the project folder, so in production point
`UPLOAD_DIR` at a persistent directory outside the deploy path:

```bash
sudo mkdir -p /var/lib/umbakes/uploads
sudo chown <app-user> /var/lib/umbakes/uploads
# .env: UPLOAD_DIR="/var/lib/umbakes/uploads"
```

The database stores only each image's relative path and metadata, so the uploads folder and the database must be backed up **together**:

```bash
pg_dump "$DATABASE_URL" -Fc -f umbakes-$(date +%F).dump
tar czf uploads-$(date +%F).tgz -C /var/lib/umbakes uploads
```

## How it works

- **Content** is stored in PostgreSQL and edited at `/admin`. Pages render on each request, so changes appear immediately.
- **Ordering** works through WhatsApp only. Every order link is built by `src/lib/whatsapp.ts` from the number in
  Admin › Settings. The message includes the product's name, category, reference ID, page link and price.
- **Images** are validated by decoding the actual file (not the extension), resized to at most 2000 px, re-encoded as WebP,
  and saved under a random filename. Every database link to an image is `onDelete: Restrict`, so an image still in
  use can never be deleted. Replacing or removing an image only deletes the old file once nothing else uses it.
- **Admin security:** bcrypt password hashes; server-side sessions (only a SHA-256 of the cookie token is stored); httpOnly
  SameSite cookies; every server action calls `requireAdmin()`; login rate limiting; Next.js server-action origin checks.

## Before launch

- [ ] Admin › Settings: set the WhatsApp number, and add location and hours if you want them shown.
- [ ] Delete or replace the `[Sample]` products (the dashboard lists them).
- [ ] Upload real cake photos for products, categories, the hero and the gallery. Add a higher-resolution logo if available (the one from Instagram is 100×100 px).
- [ ] Add genuine customer reviews and approve them.
- [ ] Change the admin password (Admin › Settings).
- [ ] Review the Privacy and Terms pages.
