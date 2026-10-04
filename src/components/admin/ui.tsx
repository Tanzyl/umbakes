import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-4xl font-semibold">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-ivory p-5 sm:p-7 ${className}`}>
      {title && <h2 className="mb-5 font-sans text-sm font-medium tracking-[0.16em] text-muted uppercase">{title}</h2>}
      {children}
    </section>
  );
}

export function Thumb({ src, alt = "" }: { src?: string | null; alt?: string }) {
  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-brand-soft">
      {src ? <Image src={src} alt={alt} fill sizes="56px" className="object-cover" /> : <ImageOff className="absolute inset-0 m-auto size-5 text-muted" aria-hidden />}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "amber" | "red" | "brand" }) {
  const tones = {
    neutral: "bg-line/60 text-ink/70",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-900",
    red: "bg-red-100 text-red-800",
    brand: "bg-brand-soft text-brand",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, text, href, cta }: { title: string; text: string; href?: string; cta?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-ivory p-10 text-center">
      <p className="font-display text-2xl">{title}</p>
      <p className="mt-2 text-muted">{text}</p>
      {href && cta && <Link href={href} className="btn-primary mt-6">{cta}</Link>}
    </div>
  );
}
