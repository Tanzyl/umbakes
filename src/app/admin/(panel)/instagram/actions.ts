"use server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { invalid, logActivity, moveItem, parseForm, refreshSite, type ActionState } from "@/lib/admin";
import { deleteMediaIfUnused, saveUpload, UploadError } from "@/lib/media";

const schema = z.object({
  postUrl: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^https:\/\/(www\.)?instagram\.com\//.test(v), "Paste a link starting with https://www.instagram.com/")
    .default(""),
  alt: z.string().trim().max(300).default(""),
});

export async function addInstagramPost(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(schema, fd);
  if (!parsed.success) return invalid(parsed.error);
  const file = fd.get("imageFile");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a photo", fieldErrors: { imageFile: ["Choose a photo"] } };
  try {
    const media = await saveUpload(file, "instagram", parsed.data.alt || "UMBAKES on Instagram");
    await db.instagramPost.create({ data: { mediaId: media.id, postUrl: parsed.data.postUrl, sortOrder: -1 } });
  } catch (e) {
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
  await logActivity("Added Instagram photo", parsed.data.postUrl || "photo");
  refreshSite();
  return { ok: true, message: "Photo added" };
}

export async function moveInstagramPost(fd: FormData) {
  await requireAdmin();
  await moveItem("instagramPost", String(fd.get("id")), fd.get("dir") === "up" ? -1 : 1);
  refreshSite();
}

export async function toggleInstagramPost(fd: FormData) {
  await requireAdmin();
  const p = await db.instagramPost.findUnique({ where: { id: String(fd.get("id")) } });
  if (!p) return;
  await db.instagramPost.update({ where: { id: p.id }, data: { isVisible: !p.isVisible } });
  refreshSite();
}

export async function deleteInstagramPost(fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const p = await db.instagramPost.findUnique({ where: { id: String(fd.get("id")) } });
  if (!p) return { error: "Not found" };
  await db.instagramPost.delete({ where: { id: p.id } });
  await deleteMediaIfUnused(p.mediaId);
  await logActivity("Removed Instagram photo", p.postUrl || "photo");
  refreshSite();
  return { ok: true, message: "Photo removed" };
}
