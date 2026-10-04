/**
 * Idempotent seed: safe to run repeatedly.
 * - Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD (if no admin exists yet).
 * - Creates settings + homepage sections with default copy (never overwrites owner edits).
 * - Creates the real menu categories from the UMBAKES Instagram menu post.
 * - Imports the real logo and owner photo from prisma/seed-assets.
 * - Unless SEED_SAMPLES=false, adds sample products labelled "[Sample]" with no prices,
 *   and sample reviews that are NOT approved (so never public). Delete them before launch.
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type CategoryKind } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const uploadRoot = path.resolve(process.env.UPLOAD_DIR || "uploads");

async function importImage(file: string, folder: string, alt: string) {
  const original = path.basename(file);
  const existing = await db.mediaAsset.findFirst({ where: { originalName: original, folder } });
  if (existing) return existing;
  const { data, info } = await sharp(await readFile(file)).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
  const rel = `${folder}/${randomUUID()}.webp`;
  await mkdir(path.join(uploadRoot, folder), { recursive: true });
  await writeFile(path.join(uploadRoot, rel), data);
  return db.mediaAsset.create({ data: { path: rel, folder, alt, width: info.width, height: info.height, size: info.size, originalName: original } });
}

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function main() {
  // Admin
  if ((await db.adminUser.count()) === 0) {
    const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || password.length < 10) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ chars) in .env");
    await db.adminUser.create({ data: { email, passwordHash: await bcrypt.hash(password, 12) } });
    console.log(`Created admin ${email}`);
  }

  // Real brand assets from Instagram
  const assets = path.join(import.meta.dirname, "seed-assets");
  const logo = await importImage(path.join(assets, "logo.jpg"), "site", "UMBAKES logo");
  const owner = await importImage(path.join(assets, "owner.jpg"), "site", "The baker behind UMBAKES decorating a cake");

  await db.websiteSettings.upsert({ where: { id: 1 }, create: { id: 1, logoId: logo.id }, update: {} });

  const sections: { key: string; title: string; subtitle?: string; body?: string; ctaLabel?: string; ctaHref?: string; secondaryLabel?: string; imageId?: string }[] = [
    { key: "hero", subtitle: "Baking life sweet", title: "Every Cake Tells a Story", body: "Beautifully crafted cakes and sweet treats, designed especially for your special moments.", ctaLabel: "Explore Our Cakes", ctaHref: "/cakes", secondaryLabel: "Order on WhatsApp" },
    { key: "featuredCakes", title: "Featured Custom Cakes", subtitle: "A few favourite designs. Each can be personalised with your colours, message and flavour.", ctaLabel: "See all cakes", ctaHref: "/cakes" },
    { key: "menu", title: "Explore Our Menu", subtitle: "From celebration cakes to everyday treats, freshly baked and made with love." },
    { key: "popular", title: "Popular Picks", subtitle: "The treats our customers come back for." },
    { key: "occasions", title: "Cakes for Every Moment", subtitle: "Birthdays, weddings, bridal showers and everything worth celebrating.", ctaLabel: "Have a Special Design in Mind?", secondaryLabel: "Discuss Your Custom Cake", body: "Share your idea, theme or a photo for inspiration, and we'll bring it to life." },
    { key: "gallery", title: "Cake Inspiration Gallery", subtitle: "A look at some of the cakes we've made for our customers.", ctaLabel: "View full gallery" },
    { key: "about", title: "Made with Love, Crafted for Your Moments", subtitle: "At UMBAKES, every creation is made to bring a little more sweetness to your special moments.", body: "From beautifully designed celebration cakes to delightful everyday treats, our focus is on creativity, quality, and your personal preferences.", ctaLabel: "Explore the gallery", ctaHref: "/gallery", imageId: owner.id },
    { key: "howToOrder", title: "How to Order", subtitle: "Four simple steps, all on WhatsApp. No account needed." },
    { key: "reviews", title: "What Our Customers Say" },
    { key: "instagram", title: "Follow Our Sweet Creations", subtitle: "See our latest cakes and behind-the-scenes moments on Instagram.", ctaLabel: "Follow @umbakes_" },
  ];
  for (const [i, s] of sections.entries()) {
    await db.homepageSection.upsert({ where: { key: s.key }, create: { ...s, sortOrder: i }, update: {} });
  }

  // Categories: MENU ones are exactly those on the Instagram menu post; CAKE ones are occasion types.
  const cats: [CategoryKind, string, string][] = [
    ["CAKE", "Birthday Cakes", "Personalised birthday cakes for every age and theme."],
    ["CAKE", "Wedding Cakes", "Elegant tiered cakes for your big day."],
    ["CAKE", "Bridal Shower Cakes", "Soft, romantic designs for the bride-to-be."],
    ["CAKE", "Engagement Cakes", "Celebrate the yes with a cake to remember."],
    ["CAKE", "Anniversary Cakes", "Sweet ways to mark the years together."],
    ["CAKE", "Kids' Theme Cakes", "Favourite characters and colourful themes."],
    ["CAKE", "Baby Shower Cakes", "Gentle, joyful designs to welcome the little one."],
    ["CAKE", "Floral & Minimal Cakes", "Clean lines, fresh florals and modern finishes."],
    ["MENU", "Cakes", "Classic cakes in our favourite flavours."],
    ["MENU", "Cupcakes", "Swirled, filled and decorated cupcakes."],
    ["MENU", "Brownies", "Rich, fudgy brownies."],
    ["MENU", "Mousse", "Light and creamy mousse cups."],
    ["MENU", "Cookies", "Freshly baked cookies."],
    ["MENU", "Tea Snacks", "Savoury and sweet bites for tea time."],
  ];
  const catIds: Record<string, string> = {};
  for (const [i, [kind, name, description]] of cats.entries()) {
    const c = await db.category.upsert({ where: { slug: slugify(name) }, create: { kind, name, slug: slugify(name), description, sortOrder: i }, update: {} });
    catIds[name] = c.id;
  }

  if (process.env.SEED_SAMPLES === "false") return;

  // Sample content: clearly labelled, no invented prices.
  const samples: [string, string, Partial<{ isFeatured: boolean; isPopular: boolean; isNew: boolean }>][] = [
    ["Birthday Cakes", "Pastel Floral Birthday Cake", { isFeatured: true }],
    ["Wedding Cakes", "Classic Two-Tier Wedding Cake", { isFeatured: true }],
    ["Bridal Shower Cakes", "Blush Bridal Shower Cake", { isFeatured: true }],
    ["Kids' Theme Cakes", "Character Theme Cake", { isFeatured: true }],
    ["Engagement Cakes", "Gold Accent Engagement Cake", { isFeatured: true }],
    ["Anniversary Cakes", "Heart Anniversary Cake", { isFeatured: true }],
    ["Cupcakes", "Assorted Cupcake Box", { isPopular: true }],
    ["Brownies", "Fudge Brownies", { isPopular: true }],
    ["Mousse", "Chocolate Mousse Cup", { isNew: true }],
    ["Cookies", "Chocolate Chip Cookies", { isPopular: true }],
  ];
  for (const [i, [cat, name, flags]] of samples.entries()) {
    const label = `[Sample] ${name}`;
    const prefix = cats.find(([, n]) => n === cat)?.[0] === "CAKE" ? "CAKE" : "ITEM";
    await db.product.upsert({
      where: { slug: slugify(name) },
      create: {
        name: label,
        slug: slugify(name),
        ref: `${prefix}-${String(101 + i)}`,
        categoryId: catIds[cat],
        description: "Sample item. Replace with a real product and photo, or delete before launch.",
        customization: "Flavour, size, colours and message can be personalised.",
        sortOrder: i,
        ...flags,
      },
      update: {},
    });
  }

  if ((await db.review.count()) === 0) {
    await db.review.createMany({
      data: [
        { name: "[Sample] Customer name", text: "Sample review. Replace with a real customer review before approving.", rating: 5, isApproved: false },
        { name: "[Sample] Another customer", text: "Sample review. Only approved reviews are shown on the website.", isApproved: false },
      ],
    });
  }
  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
