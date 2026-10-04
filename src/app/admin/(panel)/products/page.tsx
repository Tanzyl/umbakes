import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { mediaUrl } from "@/lib/media";
import { formatPrice } from "@/lib/whatsapp";
import { ConfirmAction, QuickAction } from "@/components/admin/forms";
import { Badge, EmptyState, PageTitle, Thumb } from "@/components/admin/ui";
import { deleteProduct, moveProduct, toggleProduct } from "./actions";

export const metadata = { title: "Cakes & Products" };

const FILTERS = { all: "All", featured: "Featured", popular: "Popular", hidden: "Hidden", unavailable: "Unavailable" } as const;

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const filter = (typeof sp.filter === "string" && sp.filter in FILTERS ? sp.filter : "all") as keyof typeof FILTERS;
  const cat = typeof sp.category === "string" ? sp.category : "";

  const where: Prisma.ProductWhereInput = {
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { ref: { contains: q, mode: "insensitive" } }] } : {}),
    ...(cat ? { categoryId: cat } : {}),
    ...(filter === "featured" && { isFeatured: true }),
    ...(filter === "popular" && { isPopular: true }),
    ...(filter === "hidden" && { isPublished: false }),
    ...(filter === "unavailable" && { isAvailable: false }),
  };
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: "asc" }, take: 1, include: { media: true } } },
    }),
    db.category.findMany({ orderBy: [{ kind: "asc" }, { sortOrder: "asc" }], select: { id: true, name: true } }),
  ]);
  const reorderable = !q && !cat && filter === "all";

  return (
    <>
      <PageTitle
        title="Cakes & Products"
        description="Everything customers can browse and order. Prices are optional. Leave blank for “price on request”."
        action={<Link href="/admin/products/new" className="btn-primary"><Plus className="size-4" aria-hidden /> Add product</Link>}
      />

      <form className="mb-5 flex flex-col gap-3 sm:flex-row" role="search">
        <label className="relative flex-1">
          <span className="sr-only">Search products</span>
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input name="q" defaultValue={q} placeholder="Search by name or reference…" className="h-11 w-full rounded-xl border border-line bg-white pr-3 pl-10 text-[15px]" />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select name="category" defaultValue={cat} className="h-11 w-full rounded-xl border border-line bg-white px-3 text-[15px] sm:w-52">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <input type="hidden" name="filter" value={filter} />
        <button className="btn-outline h-11">Search</button>
      </form>
      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Filter">
        {Object.entries(FILTERS).map(([k, label]) => (
          <Link
            key={k}
            href={{ query: { ...(q && { q }), ...(cat && { category: cat }), ...(k !== "all" && { filter: k }) } }}
            aria-current={filter === k ? "true" : undefined}
            className={`rounded-full border px-4 py-1.5 text-sm ${filter === k ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40"}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {products.length === 0 ? (
        <EmptyState title="No products found" text={q || cat || filter !== "all" ? "Try a different search or filter." : "Add your first cake or product to get started."} href="/admin/products/new" cta="Add product" />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-ivory">
          {products.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-3 sm:px-5">
              <Thumb src={p.images[0] ? mediaUrl(p.images[0].media.path) : null} />
              <div className="min-w-0 flex-1">
                <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-brand">{p.name}</Link>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                  <span>{p.ref}</span>
                  <span>· {p.category.name}</span>
                  <span>· {formatPrice(p.price, p.priceIsStarting) ?? "Price on request"}</span>
                  {!p.isPublished && <Badge tone="amber">Hidden</Badge>}
                  {p.isFeatured && <Badge tone="brand">Featured</Badge>}
                  {p.isPopular && <Badge>Popular</Badge>}
                  {p.isNew && <Badge>New</Badge>}
                  {p.isSeasonal && <Badge>Seasonal</Badge>}
                  {!p.isAvailable && <Badge tone="red">Unavailable</Badge>}
                  {p.images.length === 0 && <Badge tone="amber">No photo</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {reorderable && (
                  <>
                    <QuickAction action={moveProduct} hidden={{ id: p.id, dir: "up" }} label="Move up"><ArrowUp className="size-4" /></QuickAction>
                    <QuickAction action={moveProduct} hidden={{ id: p.id, dir: "down" }} label="Move down"><ArrowDown className="size-4" /></QuickAction>
                  </>
                )}
                <QuickAction action={toggleProduct} hidden={{ id: p.id, field: "isFeatured" }} label={p.isFeatured ? "Remove from featured" : "Feature on homepage"}>
                  <Star className={`size-4 ${p.isFeatured ? "fill-accent text-accent" : ""}`} />
                </QuickAction>
                <QuickAction action={toggleProduct} hidden={{ id: p.id, field: "isPublished" }} label={p.isPublished ? "Hide" : "Publish"}>
                  {p.isPublished ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </QuickAction>
                <Link href={`/admin/products/${p.id}`} aria-label={`Edit ${p.name}`} className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white hover:bg-brand-soft"><Pencil className="size-4" /></Link>
                <ConfirmAction action={deleteProduct} hidden={{ id: p.id }} title={`Delete “${p.name}”?`} description="This removes the product and its photos (unless a photo is used elsewhere). This can't be undone." className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white text-red-700 hover:bg-red-50">
                  <Trash2 className="size-4" aria-label="Delete" />
                </ConfirmAction>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!reorderable && products.length > 1 && <p className="mt-3 text-xs text-muted">Clear the search and filters to reorder products.</p>}
    </>
  );
}
