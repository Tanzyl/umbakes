"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleImageList, imageListMediaIds } from "@/lib/admin-images";
import { invalid, logActivity, moveItem, nextRef, parseForm, refreshSite, zf, type ActionState } from "@/lib/admin";
import { deleteMediaIfUnused, UploadError } from "@/lib/media";

const schema = z.object({
  title: zf.required("Title", 120),
  description: zf.text(800),
  categoryId: zf.text(40),
  isFeatured: zf.bool(),
  isPublished: zf.bool(),
});

export async function saveGalleryItem(id: string | null, _: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(schema, fd);
  if (!parsed.success) return invalid(parsed.error);
  const data = { ...parsed.data, categoryId: parsed.data.categoryId || null };

  let savedId = id;
  try {
    if (id) await db.galleryItem.update({ where: { id }, data });
    else {
      const ref = await nextRef("GAL", () => db.galleryItem.findMany({ select: { ref: true } }));
      savedId = (await db.galleryItem.create({ data: { ...data, ref, sortOrder: -1 } })).id; // newest first
      await moveItem("galleryItem", savedId, -1); // normalises order
    }
    await handleImageList(fd, "gallery", savedId!, "gallery", data.title);
    await logActivity(id ? "Updated gallery design" : "Added gallery design", data.title);
  } catch (e) {
    if (e instanceof UploadError) {
      if (!id && savedId) redirect(`/admin/gallery/${savedId}?uploadError=${encodeURIComponent(e.message)}`);
      return { error: e.message };
    }
    throw e;
  }
  refreshSite();
  if (!id) redirect(`/admin/gallery/${savedId}?created=1`);
  return { ok: true, message: "Design saved" };
}

export async function deleteGalleryItem(fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(fd.get("id"));
  const g = await db.galleryItem.findUnique({ where: { id } });
  if (!g) return { error: "Design not found" };
  const mediaIds = await imageListMediaIds("gallery", id);
  await db.galleryItem.delete({ where: { id } });
  for (const m of mediaIds) await deleteMediaIfUnused(m);
  await logActivity("Deleted gallery design", g.title);
  refreshSite();
  return { ok: true, message: "Design deleted" };
}

export async function deleteGalleryItemAndReturn(fd: FormData) {
  const res = await deleteGalleryItem(fd);
  if (res?.error) return res;
  redirect("/admin/gallery");
}

export async function moveGalleryItem(fd: FormData) {
  await requireAdmin();
  await moveItem("galleryItem", String(fd.get("id")), fd.get("dir") === "up" ? -1 : 1);
  refreshSite();
}

export async function toggleGalleryItem(fd: FormData) {
  await requireAdmin();
  const g = await db.galleryItem.findUnique({ where: { id: String(fd.get("id")) } });
  if (!g) return;
  await db.galleryItem.update({ where: { id: g.id }, data: { isPublished: !g.isPublished } });
  refreshSite();
}
