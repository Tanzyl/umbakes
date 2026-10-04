import "server-only";
import { z } from "zod";
import { db } from "./db";
import { deleteMediaIfUnused, saveUpload, UploadError, type MediaFolder } from "./media";

const files = (fd: FormData, name: string) => fd.getAll(name).filter((f): f is File => f instanceof File && f.size > 0);

/**
 * Handles an <ImageField name=…>. Returns the media id to store and a cleanup function to call
 * AFTER the owning record has been saved (so the old file is only removed once nothing uses it).
 */
export async function handleSingleImage(fd: FormData, name: string, folder: MediaFolder, currentId: string | null) {
  const alt = String(fd.get(`${name}Alt`) ?? "").trim().slice(0, 300);
  const [file] = files(fd, `${name}File`);
  if (file) {
    const media = await saveUpload(file, folder, alt);
    return { id: media.id as string | null, cleanup: () => deleteMediaIfUnused(currentId) };
  }
  if (fd.get(`${name}Remove`) === "on") return { id: null, cleanup: () => deleteMediaIfUnused(currentId) };
  if (currentId) await db.mediaAsset.update({ where: { id: currentId }, data: { alt } });
  return { id: currentId, cleanup: async () => false };
}

const stateSchema = z.array(z.object({ id: z.string(), alt: z.string().max(300) })).max(40);

/**
 * Handles an <ImagesField> for products or gallery items: keeps/reorders/removes existing rows,
 * updates alt text, uploads new files. Removed files are deleted only if unused elsewhere.
 */
export async function handleImageList(fd: FormData, kind: "product" | "gallery", ownerId: string, folder: MediaFolder, fallbackAlt: string) {
  const parsed = stateSchema.safeParse(JSON.parse(String(fd.get("imagesState") ?? "[]")));
  if (!parsed.success) throw new UploadError("Invalid image list");
  const keep = parsed.data;

  const model = (kind === "product" ? db.productImage : db.galleryImage) as unknown as {
    findMany: (a: object) => Promise<{ id: string; mediaId: string }[]>;
    deleteMany: (a: object) => Promise<unknown>;
    update: (a: object) => Promise<unknown>;
    create: (a: object) => Promise<unknown>;
  };
  const ownerKey = kind === "product" ? "productId" : "itemId";
  const current = await model.findMany({ where: { [ownerKey]: ownerId } });
  const keepIds = new Set(keep.map((k) => k.id));
  const removed = current.filter((c) => !keepIds.has(c.id));

  // Upload first so a bad file aborts before anything is changed.
  const uploaded = [];
  for (const f of files(fd, "newImages")) uploaded.push(await saveUpload(f, folder, fallbackAlt));

  await model.deleteMany({ where: { id: { in: removed.map((r) => r.id) } } });
  for (const [n, k] of keep.entries()) {
    const row = current.find((c) => c.id === k.id);
    if (!row) continue;
    await model.update({ where: { id: row.id }, data: { sortOrder: n } });
    await db.mediaAsset.update({ where: { id: row.mediaId }, data: { alt: k.alt.trim() } });
  }
  for (const [n, m] of uploaded.entries()) {
    await model.create({ data: { [ownerKey]: ownerId, mediaId: m.id, sortOrder: keep.length + n } });
  }
  for (const r of removed) await deleteMediaIfUnused(r.mediaId);
}

/** Media ids owned by a record's image list, for cleanup after the record itself is deleted. */
export async function imageListMediaIds(kind: "product" | "gallery", ownerId: string) {
  const rows =
    kind === "product"
      ? await db.productImage.findMany({ where: { productId: ownerId }, select: { mediaId: true } })
      : await db.galleryImage.findMany({ where: { itemId: ownerId }, select: { mediaId: true } });
  return rows.map((r) => r.mediaId);
}
