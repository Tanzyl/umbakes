"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CakeSlice, ExternalLink, FolderTree, Home, Images, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, Sparkles, X } from "lucide-react";
import { InstagramIcon } from "@/components/site/WhatsAppIcon";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Cakes & Products", icon: CakeSlice },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/gallery", label: "Gallery", icon: Sparkles },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/instagram", label: "Instagram", icon: InstagramIcon },
  { href: "/admin/media", label: "Media Library", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ logo, name, email, logout }: { logo: React.ReactNode; name: string; email: string; logout: () => Promise<void> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="sticky top-0 z-40 border-b border-line bg-ivory lg:h-dvh lg:border-r lg:border-b-0">
      <div className="flex h-16 items-center justify-between px-4 lg:h-20 lg:px-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          {logo}
          <span className="leading-tight">
            <span className="block font-display text-xl font-bold text-brand">{name}</span>
            <span className="block text-xs text-muted">Admin</span>
          </span>
        </Link>
        <button type="button" className="inline-flex size-11 items-center justify-center rounded-lg lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      <nav className={`${open ? "block" : "hidden"} border-t border-line px-3 pb-4 lg:flex lg:h-[calc(100dvh-5rem)] lg:flex-col lg:border-0`} aria-label="Admin">
        <ul className="space-y-0.5 pt-3">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] ${active(n.href) ? "bg-brand text-white" : "text-ink/80 hover:bg-brand-soft"}`}
              >
                <n.icon className="size-[18px]" aria-hidden />
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-1 border-t border-line pt-4 lg:mt-auto">
          <a href="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] text-ink/80 hover:bg-brand-soft">
            <ExternalLink className="size-[18px]" aria-hidden /> View website
          </a>
          <form action={logout}>
            <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] text-ink/80 hover:bg-brand-soft">
              <LogOut className="size-[18px]" aria-hidden /> Sign out
            </button>
          </form>
          <p className="truncate px-3 pt-1 text-xs text-muted" title={email}>{email}</p>
        </div>
      </nav>
    </aside>
  );
}
