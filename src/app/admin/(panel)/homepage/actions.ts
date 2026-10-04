"use server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleSingleImage } from "@/lib/admin-images";
import { invalid, logActivity, parseForm, refreshSite, zf, type ActionState } from "@/lib/admin";
import { UploadError } from "@/lib/media";

const schema = z.object({
  title: zf.text(160),
  subtitle: zf.text(400),
  body: zf.text(2000),
  ctaLabel: zf.text(60),
  ctaHref: z
    .string()
    .trim()
    .max(200)
    .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), "Use a page like /cakes or a full https:// link")
    .default(""),
  secondaryLabel: zf.text(60),
  isVisible: zf.bool(),
});

export async function saveSection(key: string, _: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(schema, fd);
  if (!parsed.success) return invalid(parsed.error);
  const section = await db.homepageSection.findUnique({ where: { key } });
  if (!section) return { error: "Section not found" };
  try {
    const img = fd.has("imageAlt") ? await handleSingleImage(fd, "image", "site", section.imageId) : null;
    await db.homepageSection.update({ where: { key }, data: { ...parsed.data, ...(img && { imageId: img.id }) } });
    await img?.cleanup();
  } catch (e) {
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
  await logActivity("Updated homepage section", parsed.data.title || key);
  refreshSite();
  return { ok: true, message: "Section saved" };
}

export async function moveSection(fd: FormData) {
  await requireAdmin();
  const key = String(fd.get("key"));
  const rows = await db.homepageSection.findMany({ orderBy: { sortOrder: "asc" }, select: { key: true } });
  const i = rows.findIndex((r) => r.key === key);
  const j = i + (fd.get("dir") === "up" ? -1 : 1);
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await db.$transaction(rows.map((r, n) => db.homepageSection.update({ where: { key: r.key }, data: { sortOrder: n } })));
  refreshSite();
}

export async function toggleSection(fd: FormData) {
  await requireAdmin();
  const s = await db.homepageSection.findUnique({ where: { key: String(fd.get("key")) } });
  if (!s) return;
  await db.homepageSection.update({ where: { key: s.key }, data: { isVisible: !s.isVisible } });
  await logActivity(s.isVisible ? "Hid homepage section" : "Showed homepage section", s.title || s.key);
  refreshSite();
}
