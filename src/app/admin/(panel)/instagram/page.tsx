import Image from "next/image";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { mediaUrl } from "@/lib/media";
import { ActionForm, ConfirmAction, Field, QuickAction, SubmitButton } from "@/components/admin/forms";
import { Badge, PageTitle, Panel } from "@/components/admin/ui";
import { addInstagramPost, deleteInstagramPost, moveInstagramPost, toggleInstagramPost } from "./actions";

export const metadata = { title: "Instagram" };

export default async function InstagramAdmin() {
  const posts = await db.instagramPost.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { media: true } });
  return (
    <>
      <PageTitle
        title="Instagram showcase"
        description="Choose photos from your Instagram to show on the homepage (up to 8). Each one can link to its Instagram post. This is a hand-picked showcase, not a live feed."
      />
      <Panel title="Add a photo" className="mb-8">
        <ActionForm action={addInstagramPost} resetOnSuccess className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="ig-file">Photo</label>
            <input id="ig-file" type="file" name="imageFile" accept="image/*" required className="mt-1.5 block w-full rounded-xl border border-line bg-white p-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-brand" />
          </div>
          <Field name="postUrl" label="Instagram post link (optional)" placeholder="https://www.instagram.com/p/…" />
          <Field name="alt" label="Photo description" placeholder="e.g. Pastel birthday cake with gold drip" />
          <div className="sm:col-span-2 flex justify-end"><SubmitButton>Add photo</SubmitButton></div>
        </ActionForm>
      </Panel>
      {posts.length === 0 ? <p className="text-muted">No photos yet. The section still shows a “Follow us” button linking to your profile.</p> : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((p, i) => (
            <li key={p.id} className="overflow-hidden rounded-2xl border border-line bg-ivory">
              <div className="relative aspect-square bg-brand-soft">
                <Image src={mediaUrl(p.media.path)} alt={p.media.alt} fill sizes="240px" className="object-cover" />
                <span className="absolute top-2 left-2 flex gap-1">
                  {!p.isVisible && <Badge tone="amber">Hidden</Badge>}
                  {p.isVisible && i >= 8 && <Badge>Not shown (over 8)</Badge>}
                </span>
              </div>
              <div className="flex gap-1 p-2">
                <QuickAction action={moveInstagramPost} hidden={{ id: p.id, dir: "up" }} label="Move earlier"><ArrowUp className="size-4" /></QuickAction>
                <QuickAction action={moveInstagramPost} hidden={{ id: p.id, dir: "down" }} label="Move later"><ArrowDown className="size-4" /></QuickAction>
                <QuickAction action={toggleInstagramPost} hidden={{ id: p.id }} label={p.isVisible ? "Hide" : "Show"}>{p.isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}</QuickAction>
                <ConfirmAction action={deleteInstagramPost} hidden={{ id: p.id }} title="Remove this photo?" description="It will be removed from the showcase." confirmLabel="Remove" className="ml-auto inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white text-red-700 hover:bg-red-50">
                  <Trash2 className="size-4" aria-label="Remove" />
                </ConfirmAction>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
