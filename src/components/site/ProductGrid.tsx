"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Eye } from "lucide-react";
import type { ProductCardData } from "@/lib/data";
import { Carousel } from "@/components/ui/Carousel";
import { Dialog } from "@/components/ui/Dialog";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** Responsive grid of product cards; "View Design" opens a detail modal without leaving the page. */
export function ProductGrid({ products, viewLabel = "View Design", columns = "sm:grid-cols-2 lg:grid-cols-3" }: {
  products: ProductCardData[];
  viewLabel?: string;
  columns?: string;
}) {
  const [active, setActive] = useState<ProductCardData | null>(null);

  return (
    <>
      <ul className={`grid gap-x-6 gap-y-10 ${columns}`}>
        {products.map((p, n) => (
          <li key={p.id}>
            <Reveal delay={Math.min(n % 3, 2) * 0.08}>
              <ProductCard product={p} viewLabel={viewLabel} onView={() => setActive(p)} />
            </Reveal>
          </li>
        ))}
      </ul>
      <Dialog open={!!active} onClose={() => setActive(null)} label={active?.name ?? "Product details"}>
        {active && <ProductDetail product={active} />}
      </Dialog>
    </>
  );
}

function ProductCard({ product: p, onView, viewLabel }: { product: ProductCardData; onView: () => void; viewLabel: string }) {
  const img = p.images[0];
  return (
    <article className="group flex h-full flex-col">
      <button
        type="button"
        onClick={onView}
        className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-soft shadow-soft transition-shadow duration-300 group-hover:shadow-lift"
        aria-label={`View ${p.name}`}
      >
        {img ? (
          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        ) : (
          <PhotoPlaceholder />
        )}
        {p.badges.length > 0 && (
          <span className="absolute top-4 left-4 flex gap-1.5">
            {p.badges.map((b) => (
              <span key={b} className="rounded-full bg-ivory/95 px-3 py-1 text-xs font-medium text-brand shadow-sm">{b}</span>
            ))}
          </span>
        )}
        {!p.isAvailable && <span className="absolute top-4 right-4 rounded-full bg-ink/75 px-3 py-1 text-xs text-white">Currently unavailable</span>}
      </button>
      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-2xl font-semibold">{p.name}</h3>
          {p.price && <p className="shrink-0 text-[15px] font-medium text-accent-ink">{p.price}</p>}
        </div>
        {p.description && <p className="mt-1.5 line-clamp-2 text-[15px] text-muted">{p.description}</p>}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <button type="button" onClick={onView} className="btn-outline min-h-11 flex-1 px-4 text-sm">
            <Eye className="size-4" aria-hidden /> {viewLabel}
          </button>
          <a href={p.waHref} target="_blank" rel="noopener noreferrer" className="btn-wa min-h-11 flex-1 px-4 text-sm" aria-label={`Order ${p.name} on WhatsApp`}>
            <WhatsAppIcon className="size-4" /> Order
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProductDetail({ product: p, showPageLink = true }: { product: ProductCardData; showPageLink?: boolean }) {
  return (
    <div className="grid max-h-[100dvh] overflow-y-auto bg-ivory sm:max-h-[92dvh] sm:rounded-3xl lg:grid-cols-[1.1fr_1fr]">
      <Carousel images={p.images} title={p.name} className="p-3 sm:p-5" />
      <div className="flex flex-col gap-5 px-5 pt-2 pb-8 sm:px-8 lg:py-12 lg:pr-12">
        <div>
          <Link href={p.categoryHref} className="eyebrow hover:underline">{p.category}</Link>
          <h2 className="mt-2 text-4xl font-semibold sm:text-5xl">{p.name}</h2>
          <p className="mt-2 text-sm text-muted">Ref: {p.ref}</p>
        </div>
        <p className="text-xl font-medium text-accent-ink">{p.price ?? "Price on request"}</p>
        {p.description && <p className="whitespace-pre-line text-[16px] text-ink/85">{p.description}</p>}
        {p.customization && (
          <div className="rounded-2xl bg-brand-soft p-5">
            <h3 className="font-sans text-sm font-medium uppercase tracking-[0.18em] text-brand">Customisation</h3>
            <p className="mt-2 whitespace-pre-line text-[15px] text-ink/85">{p.customization}</p>
          </div>
        )}
        <div className="mt-auto flex flex-col gap-3 pt-2">
          <a href={p.waHref} target="_blank" rel="noopener noreferrer" className="btn-wa w-full">
            <WhatsAppIcon /> {p.isAvailable ? "Order on WhatsApp" : "Ask about availability"}
          </a>
          {showPageLink && (
            <Link href={p.href} className="btn-ghost w-full text-sm">
              Open full page <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          )}
          <p className="text-center text-xs text-muted">Your message will include this design&apos;s name, reference and link.</p>
        </div>
      </div>
    </div>
  );
}
