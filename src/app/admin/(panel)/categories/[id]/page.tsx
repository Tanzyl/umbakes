import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { mediaUrl } from "@/lib/media";
import { ActionForm, Field, ImageField, Select, SubmitButton, TextArea, Toggle } from "@/components/admin/forms";
import { PageTitle, Panel } from "@/components/admin/ui";
import { saveCategory } from "../actions";

export default async function EditCategoryPage({ params }: PageProps<"/admin/categories/[id]">) {
  const { id } = await params;
  const isNew = id === "new";
  const c = isNew ? null : await db.category.findUnique({ where: { id }, include: { image: true } });
  if (!isNew && !c) notFound();

  return (
    <>
      <Link href="/admin/categories" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand"><ArrowLeft className="size-4" /> All categories</Link>
      <PageTitle title={isNew ? "New category" : `Edit “${c!.name}”`} />
      <ActionForm action={saveCategory.bind(null, c?.id ?? null)}>
        <Panel>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Name" defaultValue={c?.name} required placeholder="e.g. Birthday Cakes" />
            <Select
              name="kind"
              label="Section"
              defaultValue={c?.kind ?? "CAKE"}
              options={[
                { value: "CAKE", label: "Custom Cakes (/cakes)" },
                { value: "MENU", label: "Menu (/menu)" },
              ]}
            />
            <Field name="slug" label="Web address" defaultValue={c?.slug} placeholder="Leave blank to create from the name" hint="Lowercase words joined by hyphens, e.g. birthday-cakes" />
            <div className="sm:col-span-2">
              <TextArea name="description" label="Short description" defaultValue={c?.description} rows={2} maxLength={300} />
            </div>
          </div>
        </Panel>
        <Panel>
          <ImageField key={c?.image?.id ?? "none"} name="image" label="Category image" current={c?.image ? { src: mediaUrl(c.image.path), alt: c.image.alt } : null} />
        </Panel>
        <Panel>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle name="isVisible" label="Visible on website" defaultChecked={c?.isVisible ?? true} />
            <Toggle name="showOnHome" label="Show on homepage" hint="In the Menu or Special Occasions section" defaultChecked={c?.showOnHome ?? true} />
          </div>
        </Panel>
        <div className="flex justify-end"><SubmitButton>{isNew ? "Create category" : "Save changes"}</SubmitButton></div>
      </ActionForm>
    </>
  );
}
