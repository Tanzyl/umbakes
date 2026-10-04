"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Expand } from "lucide-react";
import type { GalleryItemData } from "@/lib/data";
import { Carousel } from "@/components/ui/Carousel";
import { Dialog } from "@/components/ui/Dialog";
import { WhatsAppIcon } from "./WhatsAppIcon";

const PAGE = 12;

export function Gallery({ items, showFilters = true, initialRef }: { items: GalleryItemData[]; showFilters?: boolean; initialRef?: string }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const [activeId, setActiveId] = useState<string | null>(() => items.find((i) => i.ref === initialRef)?.id ?? null);

  const categories = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))] as string[], [items]);
  const visible = filter ? items.filter((i) => i.category === filter) : items;
  const shown = visible.slice(0, limit);
  const activeIndex = visible.findIndex((i) => i.id === activeId);
  const active = activeIndex >= 0 ? visible[activeIndex] : items.find((i) => i.id === activeId) ?? null;

  const step = (d: number) => {
    if (activeIndex < 0) return;
    setActiveId(visible[(activeIndex + d + visible.length) % visible.length].id);
  };

  return (
    <div>
      {showFilters && categories.length > 1 && (
        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="group" aria-label="Filter designs">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={filter === c}
              onClick={() => {
                setFilter(c);
                setLimit(PAGE);
              }}
              className={`min-h-11 shrink-0 rounded-full border px-5 text-sm transition-colors ${
                filter === c ? "border-brand bg-brand text-white" : "border-line bg-ivory text-ink/80 hover:border-brand/40"
              }`}
            >
              {c ?? "All designs"}
            </button>
          ))}
        </div>
      )}

      <ul className="columns-2 gap-3 sm:gap-5 lg:columns-3 xl:columns-4">
        {shown.map((item) => {
          const img = item.images[0];
          return (
            <li key={item.id} className="mb-3 break-inside-avoid sm:mb-5">
              <button
                type="button"
                onClick={() => setActiveId(item.id)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-brand-soft shadow-soft"
                aria-label={`Open ${item.title}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1280px) 300px, (min-width: 1024px) 31vw, 48vw"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/65 via-ink/0 to-transparent p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="flex w-full items-center justify-between gap-2 text-white">
                    <span className="font-display text-xl leading-tight">{item.title}</span>
                    <Expand className="size-4 shrink-0" aria-hidden />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {visible.length > limit && (
        <div className="mt-10 text-center">
          <button type="button" className="btn-outline" onClick={() => setLimit((l) => l + PAGE)}>
            Show more designs
          </button>
        </div>
      )}

      <Dialog open={!!active} onClose={() => setActiveId(null)} label={active?.title ?? "Design"}>
        {active && (
          <div
            className="grid max-h-[100dvh] overflow-y-auto bg-ivory sm:max-h-[92dvh] sm:rounded-3xl lg:grid-cols-[1.25fr_1fr]"
            onKeyDown={(e) => {
              if (e.key === "PageDown") step(1);
              if (e.key === "PageUp") step(-1);
            }}
          >
            <Carousel key={active.id} images={active.images} title={active.title} className="p-3 sm:p-5" />
            <div className="flex flex-col gap-4 px-5 pt-2 pb-8 sm:px-8 lg:py-12 lg:pr-12">
              {active.category && <p className="eyebrow">{active.category}</p>}
              <h2 className="text-4xl font-semibold">{active.title}</h2>
              <p className="text-sm text-muted">Ref: {active.ref}</p>
              {active.description && <p className="whitespace-pre-line text-ink/85">{active.description}</p>}
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <a href={active.waHref} target="_blank" rel="noopener noreferrer" className="btn-wa w-full">
                  <WhatsAppIcon /> Order a cake like this
                </a>
                {visible.length > 1 && activeIndex >= 0 && (
                  <div className="flex gap-2">
                    <button type="button" className="btn-ghost flex-1 text-sm" onClick={() => step(-1)}>← Previous design</button>
                    <button type="button" className="btn-ghost flex-1 text-sm" onClick={() => step(1)}>Next design →</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
