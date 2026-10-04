import Link from "next/link";
import { AlertTriangle, CakeSlice, FolderTree, Home, Images, MessageSquareQuote, Plus, Settings, Sparkles, Star } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/data";
import { PageTitle, Panel } from "@/components/admin/ui";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const [s, cats, hiddenCats, products, hiddenProducts, featured, gallery, media, pendingReviews, samples, noPhoto, activity] = await Promise.all([
    getSettings(),
    db.category.count(),
    db.category.count({ where: { isVisible: false } }),
    db.product.count(),
    db.product.count({ where: { isPublished: false } }),
    db.product.count({ where: { isFeatured: true, isPublished: true } }),
    db.galleryItem.count(),
    db.mediaAsset.count(),
    db.review.count({ where: { isApproved: false } }),
    db.product.count({ where: { name: { startsWith: "[Sample]" } } }),
    db.product.count({ where: { isPublished: true, images: { none: {} } } }),
    db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  const warnings = [
    !s.whatsappNumber && { text: "No WhatsApp number set. Order buttons open WhatsApp without a recipient.", href: "/admin/settings", cta: "Add number" },
    samples > 0 && { text: `${samples} sample product${samples > 1 ? "s" : ""} still on the site. Replace or delete them before launch.`, href: "/admin/products?q=%5BSample%5D", cta: "Review samples" },
    noPhoto > 0 && { text: `${noPhoto} published product${noPhoto > 1 ? "s have" : " has"} no photo yet.`, href: "/admin/products", cta: "Add photos" },
    pendingReviews > 0 && { text: `${pendingReviews} review${pendingReviews > 1 ? "s are" : " is"} waiting for approval.`, href: "/admin/reviews", cta: "Review" },
  ].filter(Boolean) as { text: string; href: string; cta: string }[];

  const stats = [
    { label: "Categories", value: cats, sub: hiddenCats ? `${hiddenCats} hidden` : "all visible", href: "/admin/categories", icon: FolderTree },
    { label: "Products", value: products, sub: `${products - hiddenProducts} published · ${hiddenProducts} hidden`, href: "/admin/products", icon: CakeSlice },
    { label: "Featured", value: featured, sub: "on the homepage", href: "/admin/products?filter=featured", icon: Star },
    { label: "Gallery designs", value: gallery, sub: `${media} images in library`, href: "/admin/gallery", icon: Sparkles },
  ];

  return (
    <>
      <PageTitle title={`Welcome back`} description={`Here's an overview of the ${s.businessName} website.`} />

      {warnings.length > 0 && (
        <ul className="mb-8 space-y-3">
          {warnings.map((w) => (
            <li key={w.text} className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
              <AlertTriangle className="size-5 shrink-0 text-amber-700" aria-hidden />
              <p className="flex-1 text-[15px] text-amber-950">{w.text}</p>
              <Link href={w.href} className="btn min-h-9 bg-white px-4 text-sm text-amber-900 shadow-sm">{w.cta}</Link>
            </li>
          ))}
        </ul>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((st) => (
          <li key={st.label}>
            <Link href={st.href} className="block rounded-2xl border border-line bg-ivory p-5 transition hover:border-brand/40 hover:shadow-soft">
              <st.icon className="size-5 text-brand" aria-hidden />
              <p className="mt-3 font-display text-4xl font-semibold">{st.value}</p>
              <p className="text-sm font-medium">{st.label}</p>
              <p className="text-xs text-muted">{st.sub}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Panel title="Quick actions">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ["/admin/products/new", "Add a cake or product", Plus],
              ["/admin/gallery/new", "Add a gallery design", Sparkles],
              ["/admin/homepage", "Edit homepage", Home],
              ["/admin/reviews", "Manage reviews", MessageSquareQuote],
              ["/admin/media", "Media library", Images],
              ["/admin/settings", "WhatsApp & settings", Settings],
            ].map(([href, label, Icon]) => {
              const I = Icon as typeof Plus;
              return (
                <Link key={href as string} href={href as string} className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-white px-4 text-[15px] hover:border-brand/40 hover:bg-brand-soft">
                  <I className="size-4.5 text-brand" aria-hidden /> {label as string}
                </Link>
              );
            })}
          </div>
        </Panel>
        <Panel title="Recent changes">
          {activity.length === 0 ? (
            <p className="text-muted">No changes yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {activity.map((a) => (
                <li key={a.id} className="flex items-baseline justify-between gap-4 py-3 text-[15px]">
                  <span><span className="text-muted">{a.action}:</span> {a.target}</span>
                  <time className="shrink-0 text-xs text-muted" dateTime={a.createdAt.toISOString()}>
                    {a.createdAt.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
