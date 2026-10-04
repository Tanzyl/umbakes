// Removes leftovers from an interrupted e2e run (anything named "E2E …").
import "dotenv/config";
import { rm } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const root = path.resolve(process.env.UPLOAD_DIR || "uploads");
const products = await db.product.findMany({ where: { name: { startsWith: "E2E " } }, include: { images: { include: { media: true } } } });
const cats = await db.category.findMany({ where: { name: { startsWith: "E2E " } }, include: { image: true } });
await db.product.deleteMany({ where: { id: { in: products.map((p) => p.id) } } });
await db.category.deleteMany({ where: { id: { in: cats.map((c) => c.id) } } });
const media = [...products.flatMap((p) => p.images.map((i) => i.media)), ...cats.flatMap((c) => (c.image ? [c.image] : []))];
for (const m of media) {
  await db.mediaAsset.delete({ where: { id: m.id } }).catch(() => {});
  await rm(path.join(root, m.path), { force: true });
}
console.log(`cleaned ${products.length} products, ${cats.length} categories, ${media.length} images`);
await db.$disconnect();
