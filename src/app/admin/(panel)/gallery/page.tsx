import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImageOff, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { mediaUrl } from "@/lib/media";
import { ConfirmAction, QuickAction } from "@/components/admin/forms";
import { Badge, EmptyState, PageTitle } from "@/components/admin/ui";
import { deleteGalleryItem, moveGalleryItem, toggleGalleryItem } from "./actions";

export const metadata = { title: "Gallery" };

export default async function GalleryAdminPage() {
  const items = await db.galleryItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { category: true, images: { orderBy: { sortOrder: "asc" }, include: { media: true } } },
  });
  return (
    <>
      <PageTitle
        title="Gallery"
        description="Your cake portfolio. Each design can have several photos, and customers can order “a cake like this” on WhatsApp."
        action={<Link href="/admin/gallery/new" className="btn-primary"><Plus className="size-4" aria-hidden /> Add design</Link>}
      />
      {items.length === 0 ? (
        <EmptyState title="No designs yet" text="Upload photos of cakes you've made to build your portfolio." href="/admin/gallery/new" cta="Add your first design" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <li key={g.id} className="overflow-hidden rounded-2xl border border-line bg-ivory">
              <Link href={`/admin/gallery/${g.id}`} className="relative block aspect-[4/3] bg-brand-soft">
                {g.images[0] ? <Image src={mediaUrl(g.images[0].media.path)} alt={g.images[0].media.alt} fill sizes="(min-width:1024px) 320px, 50vw" className="object-cover" /> : <ImageOff className="absolute inset-0 m-auto size-8 text-muted" aria-hidden />}
                <span className="absolute top-2 left-2 flex gap-1">
                  {!g.isPublished && <Badge tone="amber">Hidden</Badge>}
                  {g.isFeatured && <Badge tone="brand">Featured</Badge>}
                  {g.images.length === 0 && <Badge tone="red">No photos, not shown</Badge>}
                </span>
              </Link>
              <div className="p-4">
                <Link href={`/admin/gallery/${g.id}`} className="font-medium hover:text-brand">{g.title}</Link>
                <p className="text-xs text-muted">{g.ref} · {g.category?.name ?? "No category"} · {g.images.length} photo{g.images.length === 1 ? "" : "s"}</p>
                <div className="mt-3 flex gap-1">
                  <QuickAction action={moveGalleryItem} hidden={{ id: g.id, dir: "up" }} label="Move earlier"><ArrowUp className="size-4" /></QuickAction>
                  <QuickAction action={moveGalleryItem} hidden={{ id: g.id, dir: "down" }} label="Move later"><ArrowDown className="size-4" /></QuickAction>
                  <QuickAction action={toggleGalleryItem} hidden={{ id: g.id }} label={g.isPublished ? "Hide" : "Publish"}>{g.isPublished ? <Eye className="size-4" /> : <EyeOff className="size-4" />}</QuickAction>
                  <ConfirmAction action={deleteGalleryItem} hidden={{ id: g.id }} title={`Delete “${g.title}”?`} description="Its photos are deleted too, unless used elsewhere." className="ml-auto inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white text-red-700 hover:bg-red-50">
                    <Trash2 className="size-4" aria-label="Delete" />
                  </ConfirmAction>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
