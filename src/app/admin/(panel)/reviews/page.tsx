import { ArrowDown, ArrowUp, Check, ChevronDown, EyeOff, Plus, Star, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { mediaUrl } from "@/lib/media";
import { ActionForm, ConfirmAction, Field, ImageField, QuickAction, Select, SubmitButton, TextArea, Toggle } from "@/components/admin/forms";
import { Badge, PageTitle, Panel } from "@/components/admin/ui";
import { deleteReview, moveReview, saveReview, toggleReview } from "./actions";

export const metadata = { title: "Reviews" };

type R = Awaited<ReturnType<typeof load>>[number];
const load = () => db.review.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { photo: true } });

function ReviewFields({ r }: { r?: R }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
        <Field name="name" label="Customer name" defaultValue={r?.name} required />
        <Select name="rating" label="Rating" defaultValue={r?.rating ? String(r.rating) : ""} options={[{ value: "", label: "No rating" }, ...[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n > 1 ? "s" : ""}` }))]} />
      </div>
      <TextArea name="text" label="Review" defaultValue={r?.text} rows={3} required />
      <ImageField key={r?.photo?.id ?? "none"} name="photo" label="Customer photo (optional, with their permission)" current={r?.photo ? { src: mediaUrl(r.photo.path), alt: r.photo.alt } : null} />
      <Toggle key={String(r?.isApproved)} name="isApproved" label="Approved: show on website" defaultChecked={r?.isApproved} />
    </>
  );
}

export default async function ReviewsAdmin() {
  const reviews = await load();
  return (
    <>
      <PageTitle title="Reviews" description="Only add genuine reviews from real customers. Reviews appear on the website only after you approve them." />
      <details className="mb-8 rounded-2xl border border-line bg-ivory">
        <summary className="flex cursor-pointer list-none items-center gap-2 p-5 font-medium text-brand [&::-webkit-details-marker]:hidden"><Plus className="size-4" /> Add a review</summary>
        <div className="border-t border-line p-5 sm:p-6">
          <ActionForm action={saveReview.bind(null, null)} resetOnSuccess>
            <ReviewFields />
            <div className="flex justify-end"><SubmitButton>Add review</SubmitButton></div>
          </ActionForm>
        </div>
      </details>

      {reviews.length === 0 ? <Panel><p className="text-muted">No reviews yet.</p></Panel> : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line bg-ivory">
              <div className="flex flex-wrap items-start gap-3 p-4 sm:px-6">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{r.name}</span>
                    {r.rating && <span className="flex items-center gap-0.5 text-sm text-accent-ink"><Star className="size-3.5 fill-current" aria-hidden />{r.rating}</span>}
                    {r.isApproved ? <Badge tone="green">Approved</Badge> : <Badge tone="amber">Not shown</Badge>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[15px] text-muted">{r.text}</p>
                </div>
                <div className="flex gap-1">
                  <QuickAction action={moveReview} hidden={{ id: r.id, dir: "up" }} label="Move up"><ArrowUp className="size-4" /></QuickAction>
                  <QuickAction action={moveReview} hidden={{ id: r.id, dir: "down" }} label="Move down"><ArrowDown className="size-4" /></QuickAction>
                  <QuickAction action={toggleReview} hidden={{ id: r.id }} label={r.isApproved ? "Hide from website" : "Approve"}>{r.isApproved ? <EyeOff className="size-4" /> : <Check className="size-4" />}</QuickAction>
                  <ConfirmAction action={deleteReview} hidden={{ id: r.id }} title="Delete this review?" description="This can't be undone." className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white text-red-700 hover:bg-red-50">
                    <Trash2 className="size-4" aria-label="Delete" />
                  </ConfirmAction>
                </div>
              </div>
              <details className="group border-t border-line">
                <summary className="flex cursor-pointer list-none items-center gap-1 px-4 py-2.5 text-sm text-brand sm:px-6 [&::-webkit-details-marker]:hidden">Edit <ChevronDown className="size-4 transition group-open:rotate-180" /></summary>
                <div className="px-4 pb-5 sm:px-6">
                  <ActionForm action={saveReview.bind(null, r.id)}>
                    <ReviewFields r={r} />
                    <div className="flex justify-end"><SubmitButton>Save review</SubmitButton></div>
                  </ActionForm>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
