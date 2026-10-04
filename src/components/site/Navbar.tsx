"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/cakes", label: "Custom Cakes" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Our Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ logo, name, waHref }: { logo: React.ReactNode; name: string; waHref: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation (adjusting state during render, per React docs).

  const [prevPath, setPrevPath] = useState(pathname);

  if (pathname !== prevPath) {

    setPrevPath(pathname);

    setOpen(false);

  }

  // Lock body scroll while it's open, close on Escape.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open ? "bg-cream/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "bg-cream/0"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <nav className="container-x flex h-[72px] items-center justify-between gap-4" aria-label="Main">
        <Link href="/" className="flex items-center gap-3" aria-label={`${name} home`}>
          {logo}
          <span className="hidden font-display text-2xl font-bold tracking-wide text-brand sm:inline">{name}</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-[15px] transition-colors hover:text-brand ${
                  isActive(l.href) ? "text-brand after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:bg-accent" : "text-ink/80"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-wa hidden px-5 sm:inline-flex">
            <WhatsAppIcon className="size-4.5" />
            Order on WhatsApp
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-brand hover:bg-brand-soft lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

    </header>
    {/* Outside <header>: its backdrop-filter would make it the containing block for this fixed panel. */}
    <div
      id="mobile-menu"
      hidden={!open}
      className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-cream px-4 pb-10 lg:hidden"
    >
      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`flex min-h-14 items-center font-display text-2xl ${isActive(l.href) ? "text-brand" : "text-ink"}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-wa mt-8 w-full">
        <WhatsAppIcon />
        Order on WhatsApp
      </a>
    </div>
    </>
  );
}
