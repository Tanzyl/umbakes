import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { categoryPath } from "@/lib/data";
import { mediaUrl } from "@/lib/media";
import { ActionForm, ConfirmAction, Field, ImagesField, Select, SubmitButton, TextArea, Toggle } from "@/components/admin/forms";
import { PageTitle, Panel } from "@/components/admin/ui";
import { Flash } from "@/components/admin/Flash";
import { deleteProductAndReturn, saveProduct } from "../actions";

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const isNew = id === "new";
  const [p, categories] = await Promise.all([
    isNew ? null : db.product.findUnique({ where: { id }, include: { category: true, images: { orderBy: { sortOrder: "asc" }, include: { media: true } } } }),
    db.category.findMany({ orderBy: [{ kind: "asc" }, { sortOrder: "asc" }] }),
  ]);
  if (!isNew && !p) notFound();
  if (categories.length === 0) {
    return <p className="text-muted">Create a <Link className="text-brand underline" href="/admin/categories/new">category</Link> first.</p>;
  }

  return (
    <>
      <Flash created={sp.created === "1"} error={typeof sp.uploadError === "string" ? sp.uploadError : undefined} />
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand"><ArrowLeft className="size-4" /> All products</Link>
      <PageTitle
        title={isNew ? "Add product" : p!.name}
        action={p && p.isPublished && (
          <a href={`${categoryPath(p.category.kind, p.category.slug)}/${p.slug}`} target="_blank" className="btn-ghost"><ExternalLink className="size-4" /> View on site</a>
        )}
      />
      <ActionForm action={saveProduct.bind(null, p?.id ?? null)}>
        <Panel title="Details">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field name="name" label="Name" defaultValue={p?.name} required placeholder="e.g. Floral Birthday Cake" /></div>
            <Select
              name="categoryId"
              label="Category"
              defaultValue={p?.categoryId}
              options={categories.map((c) => ({ value: c.id, label: `${c.name} (${c.kind === "CAKE" ? "Custom Cakes" : "Menu"})` }))}
            />
            <Field name="ref" label="Reference ID" defaultValue={p?.ref} placeholder="Auto, e.g. CAKE-104" hint="Quoted in WhatsApp orders so you know exactly which design was chosen." />
            <div className="sm:col-span-2"><TextArea name="description" label="Description" defaultValue={p?.description} rows={3} /></div>
            <div className="sm:col-span-2"><TextArea name="customization" label="Customisation options" defaultValue={p?.customization} rows={3} placeholder="e.g. Available in 1–3 pounds. Flavours: chocolate, vanilla, red velvet. Name and colours can be personalised." /></div>
            <Field name="slug" label="Web address" defaultValue={p?.slug} placeholder="Leave blank to create from the name" />
          </div>
        </Panel>

        <Panel title="Photos">
          <ImagesField key={p?.images.map((i) => i.id + i.media.alt).join() ?? "new"} existing={p?.images.map((i) => ({ id: i.id, src: mediaUrl(i.media.path), alt: i.media.alt })) ?? []} />
        </Panel>

        <Panel title="Price">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="price" label="Price (PKR)" inputMode="numeric" defaultValue={p?.price ?? ""} placeholder="Leave blank for “price on request”" />
            <div className="sm:pt-7"><Toggle name="priceIsStarting" label="This is a starting price" hint="Shown as “From PKR …”" defaultChecked={p?.priceIsStarting} /></div>
          </div>
        </Panel>

        <Panel title="Visibility & labels">
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle name="isPublished" label="Published" hint="Visible on the website" defaultChecked={p?.isPublished ?? true} />
            <Toggle name="isAvailable" label="Available to order" hint="Unavailable items show a notice" defaultChecked={p?.isAvailable ?? true} />
            <Toggle name="isFeatured" label="Featured" hint="Custom cakes: shown in Featured Custom Cakes" defaultChecked={p?.isFeatured} />
            <Toggle name="isPopular" label="Popular" hint="Shown in Popular Picks" defaultChecked={p?.isPopular} />
            <Toggle name="isNew" label="New arrival" defaultChecked={p?.isNew} />
            <Toggle name="isSeasonal" label="Seasonal special" defaultChecked={p?.isSeasonal} />
          </div>
        </Panel>

        <Panel title="WhatsApp message">
          <TextArea name="whatsappNote" label="Extra line for this product's order message (optional)" defaultValue={p?.whatsappNote} rows={2} hint="Name, category, reference, link and price are added automatically." />
        </Panel>

        <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {p ? (
            <ConfirmAction action={deleteProductAndReturn} hidden={{ id: p.id }} title={`Delete “${p.name}”?`} description="This removes the product and its photos (unless a photo is used elsewhere). This can't be undone.">
              <Trash2 className="size-4" /> Delete product
            </ConfirmAction>
          ) : <span />}
          <SubmitButton>{isNew ? "Create product" : "Save changes"}</SubmitButton>
        </div>
      </ActionForm>
    </>
  );
}
