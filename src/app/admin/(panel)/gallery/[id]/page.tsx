import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { mediaUrl } from "@/lib/media";
import { ActionForm, ConfirmAction, Field, ImagesField, Select, SubmitButton, TextArea, Toggle } from "@/components/admin/forms";
import { Flash } from "@/components/admin/Flash";
import { PageTitle, Panel } from "@/components/admin/ui";
import { deleteGalleryItemAndReturn, saveGalleryItem } from "../actions";

export default async function EditGalleryPage({ params, searchParams }: PageProps<"/admin/gallery/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const isNew = id === "new";
  const [g, categories] = await Promise.all([
    isNew ? null : db.galleryItem.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" }, include: { media: true } } } }),
    db.category.findMany({ orderBy: [{ kind: "asc" }, { sortOrder: "asc" }] }),
  ]);
  if (!isNew && !g) notFound();

  return (
    <>
      <Flash created={sp.created === "1"} error={typeof sp.uploadError === "string" ? sp.uploadError : undefined} />
      <Link href="/admin/gallery" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand"><ArrowLeft className="size-4" /> Gallery</Link>
      <PageTitle title={isNew ? "Add design" : g!.title} description={g ? `Reference ${g.ref}. Customers see this in their WhatsApp message.` : undefined} />
      <ActionForm action={saveGalleryItem.bind(null, g?.id ?? null)}>
        <Panel>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="title" label="Design title" defaultValue={g?.title} required placeholder="e.g. Pink Floral Bridal Cake" />
            <Select name="categoryId" label="Category (for gallery filters)" defaultValue={g?.categoryId ?? ""} options={[{ value: "", label: "No category" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
            <div className="sm:col-span-2"><TextArea name="description" label="Description" defaultValue={g?.description} rows={3} /></div>
          </div>
        </Panel>
        <Panel title="Photos">
          <ImagesField key={g?.images.map((i) => i.id + i.media.alt).join() ?? "new"} existing={g?.images.map((i) => ({ id: i.id, src: mediaUrl(i.media.path), alt: i.media.alt })) ?? []} />
        </Panel>
        <Panel>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle name="isPublished" label="Published" defaultChecked={g?.isPublished ?? true} />
            <Toggle name="isFeatured" label="Featured" hint="Highlight this design" defaultChecked={g?.isFeatured} />
          </div>
        </Panel>
        <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {g ? (
            <ConfirmAction action={deleteGalleryItemAndReturn} hidden={{ id: g.id }} title={`Delete “${g.title}”?`} description="Its photos are deleted too, unless used elsewhere.">
              <Trash2 className="size-4" /> Delete design
            </ConfirmAction>
          ) : <span />}
          <SubmitButton>{isNew ? "Create design" : "Save changes"}</SubmitButton>
        </div>
      </ActionForm>
    </>
  );
}
