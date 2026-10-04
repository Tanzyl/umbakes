"use server";
import { rm } from "node:fs/promises";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity, refreshSite, type ActionState } from "@/lib/admin";
import { deleteMediaIfUnused, MEDIA_FOLDERS, resolveUploadPath, saveUpload, UploadError, type MediaFolder } from "@/lib/media";

export async function uploadMedia(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const folder = String(fd.get("folder")) as MediaFolder;
  if (!MEDIA_FOLDERS.includes(folder)) return { error: "Choose a folder" };
  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return { error: "Choose at least one image" };
  try {
    for (const f of files) await saveUpload(f, folder);
  } catch (e) {
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
  await logActivity("Uploaded images", `${files.length} to ${folder}`);
  return { ok: true, message: `${files.length} image${files.length > 1 ? "s" : ""} uploaded` };
}

export async function updateAlt(id: string, _: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  await db.mediaAsset.update({ where: { id }, data: { alt: String(fd.get("alt") ?? "").trim().slice(0, 300) } });
  refreshSite();
  return { ok: true, message: "Description saved" };
}

/**
 * Swaps the file behind an asset in place: every product/section using it shows the new photo.
 * The new file gets a new random name so browsers and caches don't keep the old one.
 */
export async function replaceMedia(id: string, _: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image" };
  const asset = await db.mediaAsset.findUnique({ where: { id } });
  if (!asset) return { error: "Image not found" };
  let temp;
  try {
    temp = await saveUpload(file, asset.folder as MediaFolder, asset.alt);
  } catch (e) {
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
  // Point the existing asset at the new file, drop the temporary row, remove the old file.
  await db.$transaction([
    db.mediaAsset.delete({ where: { id: temp.id } }),
    db.mediaAsset.update({ where: { id }, data: { path: temp.path, width: temp.width, height: temp.height, size: temp.size, originalName: temp.originalName } }),
  ]);
  const old = resolveUploadPath(asset.path);
  if (old) await rm(old, { force: true });
  await logActivity("Replaced image", asset.alt || asset.originalName);
  refreshSite();
  return { ok: true, message: "Image replaced everywhere it's used" };
}

export async function deleteMedia(fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const ok = await deleteMediaIfUnused(String(fd.get("id")));
  if (!ok) return { error: "This image is still in use. Remove it from the product, category or section first." };
  await logActivity("Deleted image", "from media library");
  return { ok: true, message: "Image deleted" };
}

