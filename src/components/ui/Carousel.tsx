"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Img } from "@/lib/data";
import { PhotoPlaceholder } from "@/components/site/PhotoPlaceholder";

/** Large image with prev/next, arrow keys and thumbnails. */
export function Carousel({ images, title, className = "" }: { images: Img[]; title: string; className?: string }) {
  const [i, setI] = useState(0);
  if (images.length === 0) return <div className={`aspect-[4/5] ${className}`}><PhotoPlaceholder /></div>;
  const go = (d: number) => setI((v) => (v + d + images.length) % images.length);
  const img = images[i];

  return (
    <div
      className={`flex flex-col gap-3 ${className}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-soft" aria-roledescription="carousel" aria-label={`${title} photos`}>
        <Image key={img.src} src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover motion-safe:animate-[fade-in_250ms_ease-out]" priority />
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 shadow-soft hover:bg-white">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 shadow-soft hover:bg-white">
              <ChevronRight className="size-5" />
            </button>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-3 py-1 text-xs text-white" aria-live="polite">
              {i + 1} / {images.length}
            </p>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((im, n) => (
            <button
              key={im.src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show photo ${n + 1}`}
              aria-current={n === i}
              className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${n === i ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={im.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
