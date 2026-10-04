import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { CategoryKind } from "@/generated/prisma/client";
import { getCategories, getCategory, getProduct, getProducts, getSettings } from "@/lib/data";
import { absoluteUrl } from "@/lib/whatsapp";
import { CategoryCards } from "./HomeSections";
import { ProductDetail, ProductGrid } from "./ProductGrid";
import { Reveal } from "./Reveal";

const LABEL: Record<CategoryKind, { base: string; title: string; eyebrow: string }> = {
  CAKE: { base: "/cakes", title: "Custom Cakes", eyebrow: "Designed for your moments" },
  MENU: { base: "/menu", title: "Our Menu", eyebrow: "Freshly baked" },
};

export function PageHeader({ eyebrow, title, subtitle, crumbs = [] }: { eyebrow?: string; title: string; subtitle?: string; crumbs?: { href: string; label: string }[] }) {
  return (
    <header className="container-x pt-8 pb-10 sm:pt-14 sm:pb-14">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
            <li><Link href="/" className="hover:text-brand">Home</Link></li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1">
                <ChevronRight className="size-3.5" aria-hidden />
                <Link href={c.href} className="hover:text-brand">{c.label}</Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <Reveal className="max-w-3xl">
        {eyebrow && <p className="font-script text-3xl text-accent-ink">{eyebrow}</p>}
        <h1 className="mt-1 text-5xl font-semibold sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-5 text-lg text-muted">{subtitle}</p>}
      </Reveal>
    </header>
  );
}

export async function CatalogIndex({ kind, intro, children }: { kind: CategoryKind; intro: string; children?: React.ReactNode }) {
  const categories = await getCategories(kind);
  const l = LABEL[kind];
  return (
    <>
      <PageHeader eyebrow={l.eyebrow} title={l.title} subtitle={intro} />
      <section className="container-x pb-20">
        {categories.length ? <CategoryCards categories={categories} /> : <p className="text-muted">New categories are coming soon.</p>}
      </section>
      {children}
    </>
  );
}

export async function categoryMetadata(kind: CategoryKind, slug: string) {
  const c = await getCategory(kind, slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.description || `${c.name} by UMBAKES. Order on WhatsApp.`,
    alternates: { canonical: `${LABEL[kind].base}/${c.slug}` },
    openGraph: c.image ? { images: [c.image.src] } : undefined,
  };
}

export async function CategoryView({ kind, slug }: { kind: CategoryKind; slug: string }) {
  const c = await getCategory(kind, slug);
  if (!c) notFound();
  const products = await getProducts({ categoryId: c.id });
  const l = LABEL[kind];

  return (
    <>
      <div className="relative">
        {c.image && (
          <div className="container-x pt-6">
            <div className="relative h-48 overflow-hidden rounded-3xl sm:h-72">
              <Image src={c.image.src} alt={c.image.alt} fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-cream/70 to-transparent" />
            </div>
          </div>
        )}
        <PageHeader title={c.name} subtitle={c.description} crumbs={[{ href: l.base, label: l.title }, { href: `${l.base}/${c.slug}`, label: c.name }]} />
      </div>
      <section className="container-x pb-24">
        {products.length ? (
          <ProductGrid products={products} viewLabel={kind === "CAKE" ? "View Design" : "View Details"} />
        ) : (
          <div className="card flex flex-col items-center gap-4 p-12 text-center">
            <p className="font-display text-2xl">New designs are on their way.</p>
            <p className="text-muted">Message us on WhatsApp and we&apos;ll create something just for you.</p>
          </div>
        )}
      </section>
    </>
  );
}

export async function productMetadata(kind: CategoryKind, cat: string, slug: string) {
  const p = await getProduct(kind, cat, slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.description || `${p.name} (${p.category}) by UMBAKES.`,
    alternates: { canonical: p.href },
    openGraph: p.images[0] ? { images: [p.images[0].src] } : undefined,
  };
}

export async function ProductView({ kind, cat, slug }: { kind: CategoryKind; cat: string; slug: string }) {
  const [p, s] = await Promise.all([getProduct(kind, cat, slug), getSettings()]);
  if (!p) notFound();
  const related = (await getProducts({ category: { slug: cat, kind }, NOT: { slug } }, 4));
  const l = LABEL[kind];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description || undefined,
    sku: p.ref,
    image: p.images.map((i) => absoluteUrl(i.src)),
    brand: { "@type": "Brand", name: s.businessName },
    category: p.category,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="container-x pt-8">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
          <li><Link href="/" className="hover:text-brand">Home</Link></li>
          <li className="flex items-center gap-1"><ChevronRight className="size-3.5" aria-hidden /><Link href={l.base} className="hover:text-brand">{l.title}</Link></li>
          <li className="flex items-center gap-1"><ChevronRight className="size-3.5" aria-hidden /><Link href={p.categoryHref} className="hover:text-brand">{p.category}</Link></li>
        </ol>
      </nav>
      <section className="container-x py-8 sm:py-12">
        <div className="card overflow-hidden">
          <ProductDetail product={p} showPageLink={false} />
        </div>
      </section>
      {related.length > 0 && (
        <section className="container-x pb-24">
          <h2 className="mb-8 text-4xl font-semibold">You may also like</h2>
          <ProductGrid products={related} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </section>
      )}
    </>
  );
}
