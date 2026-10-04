import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { MEDIA_FOLDERS, mediaUrl } from "@/lib/media";
import { ActionForm, ConfirmAction, Field, Select, SubmitButton } from "@/components/admin/forms";
import { Badge, PageTitle, Panel } from "@/components/admin/ui";
import { deleteMedia, replaceMedia, updateAlt, uploadMedia } from "./actions";

export const metadata = { title: "Media Library" };

const PER_PAGE = 48;

export default async function MediaPage({ searchParams }: PageProps<"/admin/media">) {
  const sp = await searchParams;
  const folder = typeof sp.folder === "string" && (MEDIA_FOLDERS as readonly string[]).includes(sp.folder) ? sp.folder : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const where = folder ? { folder } : {};
  const [assets, total] = await Promise.all([
    db.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        _count: { select: { categories: true, productImages: true, galleryImages: true, reviews: true, instagramPosts: true, sections: true, settingsLogo: true, settingsFavicon: true, settingsOg: true } },
      },
    }),
    db.mediaAsset.count({ where }),
  ]);

  return (
    <>
      <PageTitle title="Media Library" description="Every uploaded image. Replacing an image updates it everywhere it's used. Images in use can't be deleted." />

      <Panel title="Upload images" className="mb-8">
        <ActionForm action={uploadMedia} resetOnSuccess className="grid gap-4 sm:grid-cols-[1fr_200px_auto] sm:items-end">
          <div>
            <label className="text-sm font-medium" htmlFor="media-files">Images</label>
            <input id="media-files" type="file" name="files" multiple accept="image/*" required className="mt-1.5 block w-full rounded-xl border border-line bg-white p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-brand" />
          </div>
          <Select name="folder" label="Folder" defaultValue={folder ?? "gallery"} options={MEDIA_FOLDERS.map((f) => ({ value: f, label: f }))} />
          <SubmitButton>Upload</SubmitButton>
        </ActionForm>
      </Panel>

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Folders">
        {[undefined, ...MEDIA_FOLDERS].map((f) => (
          <Link key={f ?? "all"} href={f ? `?folder=${f}` : "?"} className={`rounded-full border px-4 py-1.5 text-sm capitalize ${folder === f ? "border-brand bg-brand text-white" : "border-line bg-white"}`}>
            {f ?? "All"}
          </Link>
        ))}
      </nav>

      {assets.length === 0 ? <p className="text-muted">No images here yet.</p> : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => {
            const uses = Object.values(a._count).reduce((x, y) => x + y, 0);
            return (
              <li key={a.id} className="overflow-hidden rounded-2xl border border-line bg-ivory">
                <a href={mediaUrl(a.path)} target="_blank" className="relative block aspect-[4/3] bg-brand-soft">
                  <Image src={mediaUrl(a.path)} alt={a.alt} fill sizes="(min-width:1024px) 320px, 50vw" className="object-cover" />
                </a>
                <div className="space-y-2 p-3">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                    <Badge>{a.folder}</Badge>
                    {uses ? <Badge tone="green">Used {uses}×</Badge> : <Badge tone="amber">Unused</Badge>}
                    <span>{a.width}×{a.height} · {Math.round(a.size / 1024)} KB</span>
                  </div>
                  {!a.alt && <p className="text-xs text-amber-800">Missing description</p>}
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center gap-1 text-sm text-brand [&::-webkit-details-marker]:hidden">Edit <ChevronDown className="size-4 transition group-open:rotate-180" /></summary>
                    <div className="mt-3 space-y-4">
                      <ActionForm action={updateAlt.bind(null, a.id)} className="space-y-2">
                        <Field name="alt" label="Description (alt text)" defaultValue={a.alt} />
                        <SubmitButton className="btn-outline min-h-9 px-4 text-sm">Save description</SubmitButton>
                      </ActionForm>
                      <ActionForm action={replaceMedia.bind(null, a.id)} resetOnSuccess className="space-y-2">
                        <label className="text-sm font-medium" htmlFor={`r-${a.id}`}>Replace with a new photo</label>
                        <input id={`r-${a.id}`} type="file" name="file" accept="image/*" required className="block w-full text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-brand" />
                        <SubmitButton className="btn-outline min-h-9 px-4 text-sm">Replace</SubmitButton>
                      </ActionForm>
                    </div>
                  </details>
                  {uses === 0 && (
                    <ConfirmAction action={deleteMedia} hidden={{ id: a.id }} title="Delete this image?" description="The file is permanently removed from the server.">
                      <Trash2 className="size-4" /> Delete
                    </ConfirmAction>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {total > PER_PAGE && (
        <nav className="mt-8 flex justify-center gap-2" aria-label="Pages">
          {page > 1 && <Link className="btn-outline" href={{ query: { ...(folder && { folder }), page: page - 1 } }}>Previous</Link>}
          {page * PER_PAGE < total && <Link className="btn-outline" href={{ query: { ...(folder && { folder }), page: page + 1 } }}>Next</Link>}
        </nav>
      )}
    </>
  );
}
