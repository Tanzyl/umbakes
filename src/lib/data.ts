import "server-only";
import { cache } from "react";
import type { CategoryKind, Prisma } from "@/generated/prisma/client";
import { db } from "./db";
import { mediaUrl } from "./media";
import { absoluteUrl, formatPrice, orderMessage, waLink } from "./whatsapp";

export const getSettings = cache(async () => {
  return (
    (await db.websiteSettings.findUnique({ where: { id: 1 }, include: { logo: true, favicon: true, ogImage: true } })) ??
    (await db.websiteSettings.create({ data: { id: 1 }, include: { logo: true, favicon: true, ogImage: true } }))
  );
});
export type Settings = Awaited<ReturnType<typeof getSettings>>;

export const getSections = cache(async () => {
  const rows = await db.homepageSection.findMany({ orderBy: { sortOrder: "asc" }, include: { image: true } });
  return rows;
});
export type Section = Awaited<ReturnType<typeof getSections>>[number];

export type Img = { src: string; alt: string; width: number; height: number };
const toImg = (m: { path: string; alt: string; width: number; height: number }, fallbackAlt: string): Img => ({
  src: mediaUrl(m.path),
  alt: m.alt || fallbackAlt,
  width: m.width,
  height: m.height,
});

export const categoryPath = (kind: CategoryKind, slug: string) => `/${kind === "CAKE" ? "cakes" : "menu"}/${slug}`;

const productInclude = {
  category: { select: { name: true, slug: true, kind: true } },
  images: { orderBy: { sortOrder: "asc" }, include: { media: true } },
} satisfies Prisma.ProductInclude;
type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

/** Serializable product shape for cards and modals; WhatsApp link is built here on the server. */
export type ProductCardData = {
  id: string;
  ref: string;
  name: string;
  description: string;
  customization: string;
  category: string;
  categoryHref: string;
  href: string;
  price: string | null;
  isAvailable: boolean;
  badges: string[];
  images: Img[];
  waHref: string;
};

function toCard(p: ProductRow, s: Settings): ProductCardData {
  const href = `${categoryPath(p.category.kind, p.category.slug)}/${p.slug}`;
  return {
    id: p.id,
    ref: p.ref,
    name: p.name,
    description: p.description,
    customization: p.customization,
    category: p.category.name,
    categoryHref: categoryPath(p.category.kind, p.category.slug),
    href,
    price: formatPrice(p.price, p.priceIsStarting),
    isAvailable: p.isAvailable,
    badges: [p.isNew && "New", p.isPopular && "Popular", p.isSeasonal && "Seasonal"].filter(Boolean) as string[],
    images: p.images.map((i) => toImg(i.media, p.name)),
    waHref: waLink(
      s.whatsappNumber,
      orderMessage(
        {
          name: p.name,
          category: p.category.name,
          ref: p.ref,
          url: absoluteUrl(href),
          price: p.price,
          priceIsStarting: p.priceIsStarting,
          note: p.whatsappNote,
        },
        s.businessName,
      ),
    ),
  };
}

const visibleProduct = { isPublished: true, category: { isVisible: true } } satisfies Prisma.ProductWhereInput;

export async function getProducts(where: Prisma.ProductWhereInput, take?: number) {
  const [rows, s] = await Promise.all([
    db.product.findMany({ where: { ...visibleProduct, ...where }, include: productInclude, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take }),
    getSettings(),
  ]);
  return rows.map((p) => toCard(p, s));
}

export async function getProduct(kind: CategoryKind, categorySlug: string, slug: string) {
  const [p, s] = await Promise.all([
    db.product.findFirst({ where: { ...visibleProduct, slug, category: { slug: categorySlug, kind, isVisible: true } }, include: productInclude }),
    getSettings(),
  ]);
  return p ? toCard(p, s) : null;
}

export type CategoryCardData = { id: string; name: string; slug: string; description: string; href: string; image: Img | null; count: number; showOnHome: boolean };

export const getCategories = cache(async (kind?: CategoryKind): Promise<CategoryCardData[]> => {
  const rows = await db.category.findMany({
    where: { isVisible: true, ...(kind ? { kind } : {}) },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { image: true, _count: { select: { products: { where: { isPublished: true } } } } },
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    href: categoryPath(c.kind, c.slug),
    image: c.image ? toImg(c.image, c.name) : null,
    count: c._count.products,
    showOnHome: c.showOnHome,
  }));
});

export async function getCategory(kind: CategoryKind, slug: string) {
  const c = await db.category.findFirst({ where: { kind, slug, isVisible: true }, include: { image: true } });
  if (!c) return null;
  return { ...c, image: c.image ? toImg(c.image, c.name) : null };
}

export type GalleryItemData = {
  id: string;
  ref: string;
  title: string;
  description: string;
  category: string | null;
  categorySlug: string | null;
  images: Img[];
  waHref: string;
};

export async function getGallery(opts: { featuredOnly?: boolean; take?: number } = {}): Promise<GalleryItemData[]> {
  const [rows, s] = await Promise.all([
    db.galleryItem.findMany({
      where: { isPublished: true, images: { some: {} }, ...(opts.featuredOnly ? { isFeatured: true } : {}) },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: true, images: { orderBy: { sortOrder: "asc" }, include: { media: true } } },
      take: opts.take,
    }),
    getSettings(),
  ]);
  return rows.map((g) => ({
    id: g.id,
    ref: g.ref,
    title: g.title,
    description: g.description,
    category: g.category?.isVisible ? g.category.name : null,
    categorySlug: g.category?.isVisible ? g.category.slug : null,
    images: g.images.map((i) => toImg(i.media, g.title)),
    waHref: waLink(
      s.whatsappNumber,
      orderMessage(
        { name: g.title, category: g.category?.name, ref: g.ref, url: absoluteUrl(`/gallery?design=${g.ref}`) },
        s.businessName,
      ),
    ),
  }));
}

export async function getReviews() {
  const rows = await db.review.findMany({ where: { isApproved: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { photo: true } });
  return rows.map((r) => ({ id: r.id, name: r.name, text: r.text, rating: r.rating, photo: r.photo ? toImg(r.photo, r.name) : null }));
}

export async function getInstagramPosts() {
  const rows = await db.instagramPost.findMany({ where: { isVisible: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { media: true }, take: 8 });
  return rows.map((p) => ({ id: p.id, postUrl: p.postUrl, image: toImg(p.media, "UMBAKES on Instagram") }));
}

export async function generalWaHref(message?: string) {
  const s = await getSettings();
  return waLink(s.whatsappNumber, message ?? s.whatsappGreeting);
}
