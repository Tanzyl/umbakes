import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { categoryPath } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const [cats, products] = await Promise.all([
    db.category.findMany({ where: { isVisible: true }, select: { kind: true, slug: true, updatedAt: true } }),
    db.product.findMany({
      where: { isPublished: true, category: { isVisible: true } },
      select: { slug: true, updatedAt: true, category: { select: { kind: true, slug: true } } },
    }),
  ]);
  return [
    ...["", "/cakes", "/menu", "/gallery", "/about", "/contact"].map((p) => ({ url: `${base}${p}` })),
    ...cats.map((c) => ({ url: `${base}${categoryPath(c.kind, c.slug)}`, lastModified: c.updatedAt })),
    ...products.map((p) => ({ url: `${base}${categoryPath(p.category.kind, p.category.slug)}/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
