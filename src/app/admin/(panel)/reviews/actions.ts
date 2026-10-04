"use server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleSingleImage } from "@/lib/admin-images";
import { invalid, logActivity, moveItem, parseForm, refreshSite, zf, type ActionState } from "@/lib/admin";
import { deleteMediaIfUnused, UploadError } from "@/lib/media";

const schema = z.object({
  name: zf.required("Customer name", 80),
  text: zf.required("Review text", 1000),
  rating: z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().min(1).max(5).nullable()),
  isApproved: zf.bool(),
});

export async function saveReview(id: string | null, _: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(schema, fd);
  if (!parsed.success) return invalid(parsed.error);
  try {
    const existing = id ? await db.review.findUnique({ where: { id } }) : null;
    const img = await handleSingleImage(fd, "photo", "reviews", existing?.photoId ?? null);
    if (existing) await db.review.update({ where: { id: existing.id }, data: { ...parsed.data, photoId: img.id } });
    else await db.review.create({ data: { ...parsed.data, photoId: img.id, sortOrder: -1 } });
    await img.cleanup();
  } catch (e) {
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
  await logActivity(id ? "Updated review" : "Added review", parsed.data.name);
  refreshSite();
  return { ok: true, message: id ? "Review saved" : "Review added" };
}

export async function toggleReview(fd: FormData) {
  await requireAdmin();
  const r = await db.review.findUnique({ where: { id: String(fd.get("id")) } });
  if (!r) return;
  await db.review.update({ where: { id: r.id }, data: { isApproved: !r.isApproved } });
  await logActivity(r.isApproved ? "Hid review" : "Approved review", r.name);
  refreshSite();
}

export async function moveReview(fd: FormData) {
  await requireAdmin();
  await moveItem("review", String(fd.get("id")), fd.get("dir") === "up" ? -1 : 1);
  refreshSite();
}

export async function deleteReview(fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const r = await db.review.findUnique({ where: { id: String(fd.get("id")) } });
  if (!r) return { error: "Review not found" };
  await db.review.delete({ where: { id: r.id } });
  await deleteMediaIfUnused(r.photoId);
  await logActivity("Deleted review", r.name);
  refreshSite();
  return { ok: true, message: "Review deleted" };
}
