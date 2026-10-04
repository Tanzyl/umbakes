import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp, { type Metadata } from "sharp";
import { db } from "./db";

export const MEDIA_FOLDERS = ["products", "categories", "gallery", "site", "reviews", "instagram"] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "gif", "heif"]);
const MAX_EDGE = 2000; // px, longest side after resize

// Runtime path (may be outside the project); tell Turbopack not to trace it into the build.
export const uploadRoot = () => path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || "uploads");

/** Resolves a stored relative path inside UPLOAD_DIR, or null if it would escape it. */
export function resolveUploadPath(rel: string): string | null {
  const root = uploadRoot();
  const full = path.resolve(root, rel);
  return full.startsWith(root + path.sep) ? full : null;
}

export const mediaUrl = (p: string) => `/uploads/${p}`;

export class UploadError extends Error {}

/**
 * Validates by decoding the actual bytes (not the extension or client MIME type), strips metadata,
 * resizes, re-encodes to WebP under a random name, then records it in the DB.
 */
export async function saveUpload(file: File, folder: MediaFolder, alt = "") {
  if (!MEDIA_FOLDERS.includes(folder)) throw new UploadError("Invalid folder");
  if (!file || file.size === 0) throw new UploadError("No file selected");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Image is larger than 8 MB");

  const input = Buffer.from(await file.arrayBuffer());
  let meta: Metadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    throw new UploadError("That file isn't a valid image");
  }
  if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) {
    throw new UploadError("Please upload a JPG, PNG, WebP, AVIF or HEIC image");
  }

  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const rel = `${folder}/${randomUUID()}.webp`;
  const full = resolveUploadPath(rel)!;
  try {
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, data);
  } catch (e) {
    console.error("Upload write failed", e);
    throw new UploadError("The server couldn't save the image. Check that UPLOAD_DIR is writable.");
  }

  return db.mediaAsset.create({
    data: {
      path: rel,
      folder,
      alt: alt.slice(0, 300),
      width: info.width,
      height: info.height,
      size: info.size,
      originalName: file.name.slice(0, 200),
    },
  });
}

/**
 * Deletes the asset and its file only if nothing references it any more. Every relation to
 * MediaAsset is onDelete: Restrict, so the database refuses while it is still in use.
 */
export async function deleteMediaIfUnused(id: string | null | undefined): Promise<boolean> {
  if (!id) return false;
  try {
    const asset = await db.mediaAsset.delete({ where: { id } });
    const full = resolveUploadPath(asset.path);
    if (full) await rm(full, { force: true });
    return true;
  } catch (e) {
    if ((e as { code?: string }).code === "P2003" || (e as { code?: string }).code === "P2025") return false;
    throw e;
  }
}
