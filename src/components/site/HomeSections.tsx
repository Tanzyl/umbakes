import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircleHeart, Search, Sparkles, Star, CalendarCheck } from "lucide-react";
import type { CategoryCardData, GalleryItemData, ProductCardData, Section, Settings } from "@/lib/data";
import { mediaUrl } from "@/lib/media";
import { Gallery } from "./Gallery";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { ProductGrid } from "./ProductGrid";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { InstagramIcon, WhatsAppIcon } from "./WhatsAppIcon";

const sectionImg = (s: Section) => (s.image ? { src: mediaUrl(s.image.path), alt: s.image.alt || s.title, width: s.image.width, height: s.image.height } : null);

export function Hero({ section: s, waHref, fallbackImage }: { section: Section; waHref: string; fallbackImage?: { src: string; alt: string } | null }) {
  const img = sectionImg(s) ?? fallbackImage;
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-accent-soft blur-3xl" />
      <div className="container-x relative grid items-center gap-10 pt-6 pb-16 sm:pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-16 lg:pb-24">
        {/* CSS fade (not Reveal) so the headline is visible before JavaScript loads. */}
        <div className="order-2 motion-safe:animate-[fade-in_600ms_ease-out] lg:order-1">
          {s.subtitle && <p className="font-script text-3xl text-accent-ink sm:text-4xl">{s.subtitle}</p>}
          <h1 className="mt-2 text-[2.9rem] leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">{s.title}</h1>
          {s.body && <p className="mt-6 max-w-lg text-lg text-muted">{s.body}</p>}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {s.ctaLabel && (
              <Link href={s.ctaHref || "/cakes"} className="btn-primary">
                {s.ctaLabel} <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
            {s.secondaryLabel && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <WhatsAppIcon className="size-4.5" /> {s.secondaryLabel}
              </a>
            )}
          </div>
        </div>
        <div className="relative order-1 lg:order-2">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px] sm:aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tl-[8rem] bg-brand-soft shadow-lift motion-safe:animate-[fade-in_700ms_ease-out]">
            {img ? (
              <Image src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" />
            ) : (
              <PhotoPlaceholder label="Your signature cake here" />
            )}
          </div>
          <div className="absolute -bottom-5 left-2 hidden items-center gap-3 rounded-2xl bg-ivory px-5 py-3.5 shadow-lift sm:flex lg:-left-8">
            <Sparkles className="size-5 text-accent" aria-hidden />
            <p className="text-sm"><span className="font-medium text-ink">Designed for you</span><br /><span className="text-muted">Every cake made to order</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedCakes({ section: s, products }: { section: Section; products: ProductCardData[] }) {
  if (products.length === 0) return null;
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Custom Cakes"
          title={s.title}
          subtitle={s.subtitle}
          align="left"
          action={<Link href={s.ctaHref || "/cakes"} className="btn-ghost shrink-0">{s.ctaLabel || "See all cakes"} <ArrowRight className="size-4" aria-hidden /></Link>}
        />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

export function CategoryCards({ categories, compact = false }: { categories: CategoryCardData[]; compact?: boolean }) {
  return (
    <ul className={`grid gap-4 sm:gap-6 ${compact ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-3"}`}>
      {categories.map((c, n) => (
        <li key={c.id}>
          <Reveal delay={(n % 3) * 0.07}>
            <Link href={c.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-soft shadow-soft transition-shadow duration-300 group-hover:shadow-lift sm:aspect-[5/4]">
                {c.image ? (
                  <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 1024px) 380px, 46vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                ) : (
                  <PhotoPlaceholder label={c.name} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white sm:p-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white sm:text-3xl">{c.name}</h3>
                    {c.description && <p className="mt-1 hidden text-sm text-white/80 sm:line-clamp-1 sm:block">{c.description}</p>}
                  </div>
                  <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-white group-hover:text-brand sm:inline-flex" aria-hidden>
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function MenuSection({ section: s, categories }: { section: Section; categories: CategoryCardData[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="bg-ivory py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Our Menu" title={s.title} subtitle={s.subtitle} />
        <CategoryCards categories={categories} />
      </div>
    </section>
  );
}

export function PopularSection({ section: s, products }: { section: Section; products: ProductCardData[] }) {
  if (products.length === 0) return null;
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Customer Favourites" title={s.title} subtitle={s.subtitle} />
        <ProductGrid products={products} viewLabel="View Details" columns="sm:grid-cols-2 lg:grid-cols-4" />
      </div>
    </section>
  );
}

export function OccasionsSection({ section: s, categories, waHref }: { section: Section; categories: CategoryCardData[]; waHref: string }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Special Occasions" title={s.title} subtitle={s.subtitle} />
        {categories.length > 0 && (
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.id} className="w-[68vw] shrink-0 snap-start sm:w-auto">
                <Link href={c.href} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-brand-soft shadow-soft">
                    {c.image ? (
                      <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 1024px) 290px, (min-width: 640px) 31vw, 68vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                    ) : (
                      <PhotoPlaceholder label={c.name} />
                    )}
                  </div>
                  <p className="mt-3 flex items-center justify-between font-display text-2xl">
                    {c.name}
                    <ArrowRight className="size-4 text-accent-ink transition-transform group-hover:translate-x-1" aria-hidden />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Reveal className="mt-14 flex flex-col items-center gap-5 rounded-[2rem] bg-brand px-6 py-12 text-center text-white sm:px-12">
          <MessageCircleHeart className="size-9 text-accent" strokeWidth={1.4} aria-hidden />
          <h3 className="text-4xl font-semibold text-white sm:text-5xl">{s.ctaLabel || "Have a Special Design in Mind?"}</h3>
          {s.body && <p className="max-w-xl text-white/80">{s.body}</p>}
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn bg-white text-brand hover:bg-cream">
              <WhatsAppIcon className="size-4.5" /> {s.secondaryLabel || "Discuss Your Custom Cake"}
            </a>
            <Link href="/contact#custom-cake" className="btn border border-white/40 text-white hover:bg-white/10">
              Fill in the custom cake form
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function GallerySection({ section: s, items }: { section: Section; items: GalleryItemData[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-ivory py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Cake Inspiration" title={s.title} subtitle={s.subtitle} />
        <Gallery items={items} />
        <div className="mt-10 text-center">
          <Link href="/gallery" className="btn-outline">{s.ctaLabel || "View full gallery"} <ArrowRight className="size-4" aria-hidden /></Link>
        </div>
      </div>
    </section>
  );
}

export function AboutSection({ section: s, settings }: { section: Section; settings: Settings }) {
  const img = sectionImg(s);
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-square overflow-hidden rounded-full border-[10px] border-ivory bg-brand-soft shadow-lift">
            {img ? <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 448px, 85vw" className="object-cover" /> : <PhotoPlaceholder label="Meet the baker" />}
          </div>
          {settings.tagline && (
            <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-brand px-6 py-2 font-script text-2xl whitespace-nowrap text-white shadow-soft">{settings.tagline}</p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-3">About {settings.businessName}</p>
          <h2 className="text-4xl font-semibold sm:text-5xl">{s.title}</h2>
          {s.subtitle && <p className="mt-5 text-lg text-ink/85">{s.subtitle}</p>}
          {s.body && <p className="mt-4 whitespace-pre-line text-muted">{s.body}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={s.ctaHref || "/gallery"} className="btn-primary">{s.ctaLabel || "Explore the gallery"}</Link>
            <Link href="/about" className="btn-ghost">Our story <ArrowRight className="size-4" aria-hidden /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: Search, title: "Explore Designs", text: "Browse the cake gallery and bakery menu." },
  { icon: Star, title: "Choose Your Favourite", text: "Pick a design, or use it as inspiration for something new." },
  { icon: MessageCircleHeart, title: "Contact Us", text: "Tap the WhatsApp button. Your selected item or custom details are filled in for you." },
  { icon: CalendarCheck, title: "Confirm Your Order", text: "Agree on size, flavour, price and delivery or pickup directly with us." },
];

export function HowToOrder({ section: s }: { section: Section }) {
  return (
    <section className="bg-brand-soft py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Simple Ordering" title={s.title} subtitle={s.subtitle} />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((st, n) => (
            <li key={st.title}>
              <Reveal delay={n * 0.08} className="card relative h-full p-7">
                <span className="absolute top-5 right-6 font-display text-5xl font-semibold text-accent/35" aria-hidden>{n + 1}</span>
                <st.icon className="size-8 text-brand" strokeWidth={1.4} aria-hidden />
                <h3 className="mt-5 text-2xl font-semibold"><span className="sr-only">Step {n + 1}: </span>{st.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{st.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type ReviewData = { id: string; name: string; text: string; rating: number | null; photo: { src: string; alt: string } | null };

export function ReviewsSection({ section: s, reviews }: { section: Section; reviews: ReviewData[] }) {
  if (reviews.length === 0) return null; // only real, approved reviews are ever shown
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Kind Words" title={s.title} subtitle={s.subtitle} />
        <ul className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id} className="w-[85vw] shrink-0 snap-start sm:w-auto">
              <figure className="card flex h-full flex-col p-7">
                {r.rating != null && (
                  <div className="flex gap-0.5 text-accent" aria-label={`${r.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`size-4 ${i < r.rating! ? "fill-current" : "opacity-30"}`} aria-hidden />)}
                  </div>
                )}
                <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-ink">&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-sm font-medium">
                  {r.photo ? (
                    <Image src={r.photo.src} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-full bg-brand-soft font-display text-lg text-brand" aria-hidden>{r.name[0]}</span>
                  )}
                  {r.name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function InstagramSection({ section: s, posts, url }: { section: Section; posts: { id: string; postUrl: string; image: { src: string; alt: string } }[]; url: string }) {
  if (!url) return null;
  return (
    <section className="bg-ivory py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="@umbakes_" title={s.title} subtitle={s.subtitle} />
        {posts.length > 0 && (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            {posts.map((p) => (
              <li key={p.id}>
                <a href={p.postUrl || url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-2xl bg-brand-soft">
                  <Image src={p.image.src} alt={p.image.alt} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 flex items-center justify-center bg-brand/0 opacity-0 transition group-hover:bg-brand/40 group-hover:opacity-100">
                    <InstagramIcon className="size-7 text-white" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10 text-center">
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <InstagramIcon className="size-4.5" /> {s.ctaLabel || "Follow us on Instagram"}
          </a>
        </div>
      </div>
    </section>
  );
}
