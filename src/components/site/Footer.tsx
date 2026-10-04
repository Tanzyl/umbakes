import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import type { CategoryCardData, Settings } from "@/lib/data";
import { Logo } from "./Logo";
import { InstagramIcon, WhatsAppIcon } from "./WhatsAppIcon";

export function Footer({ settings: s, categories, waHref }: { settings: Settings; categories: CategoryCardData[]; waHref: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-brand-dark text-white/85">
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo settings={s} size={56} />
            <div>
              <p className="font-display text-2xl font-bold text-white">{s.businessName}</p>
              {s.tagline && <p className="font-script text-xl text-accent">{s.tagline}</p>}
            </div>
          </div>
          {s.footerText && <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/70">{s.footerText}</p>}
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent">Explore</h2>
          <ul className="space-y-2.5 text-[15px]">
            {[
              ["/cakes", "Custom Cakes"],
              ["/menu", "Menu"],
              ["/gallery", "Our Gallery"],
              ["/about", "About Us"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {categories.length > 0 && (
          <div>
            <h2 className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent">Our Bakes</h2>
            <ul className="space-y-2.5 text-[15px]">
              {categories.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link href={c.href} className="hover:text-white">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent">Get in touch</h2>
          <ul className="space-y-3 text-[15px]">
            <li>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-white">
                <WhatsAppIcon className="size-4.5" /> Order on WhatsApp
              </a>
            </li>
            {s.instagramUrl && (
              <li>
                <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-white">
                  <InstagramIcon className="size-4.5" /> Follow on Instagram
                </a>
              </li>
            )}
            {s.phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="size-4.5" aria-hidden /> <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-white">{s.phone}</a>
              </li>
            )}
            {s.location && (
              <li className="flex gap-2.5">
                <MapPin className="mt-1 size-4.5 shrink-0" aria-hidden /> <span className="whitespace-pre-line">{s.location}</span>
              </li>
            )}
            {s.hours && (
              <li className="flex gap-2.5">
                <Clock className="mt-1 size-4.5 shrink-0" aria-hidden /> <span className="whitespace-pre-line">{s.hours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 pt-6 pb-24 text-sm text-white/60 sm:pb-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {s.businessName}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
