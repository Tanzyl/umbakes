"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleSingleImage } from "@/lib/admin-images";
import { invalid, isUniqueError, logActivity, moveItem, parseForm, refreshSite, slugify, zf, type ActionState } from "@/lib/admin";
import { deleteMediaIfUnused, UploadError } from "@/lib/media";

const schema = z.object({
  name: zf.required("Name", 80),
  slug: zf.slug(),
  kind: z.enum(["CAKE", "MENU"]),
  description: zf.text(300),
  isVisible: zf.bool(),
  showOnHome: zf.bool(),
});

export async function saveCategory(id: string | null, _: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(schema, fd);
  if (!parsed.success) return invalid(parsed.error);
  const data = { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.name) };

  try {
    const existing = id ? await db.category.findUnique({ where: { id } }) : null;
    if (id && !existing) return { error: "Category not found" };
    const img = await handleSingleImage(fd, "image", "categories", existing?.imageId ?? null);
    if (existing) {
      await db.category.update({ where: { id: existing.id }, data: { ...data, imageId: img.id } });
    } else {
      const last = await db.category.aggregate({ where: { kind: data.kind }, _max: { sortOrder: true } });
      await db.category.create({ data: { ...data, imageId: img.id, sortOrder: (last._max.sortOrder ?? -1) + 1 } });
    }
    await img.cleanup();
    await logActivity(existing ? "Updated category" : "Created category", data.name);
  } catch (e) {
    if (isUniqueError(e)) return { error: "That web address (slug) is already used.", fieldErrors: { slug: ["Already in use. Choose another."] } };
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
  refreshSite();
  if (!id) redirect("/admin/categories");
  return { ok: true, message: "Category saved" };
}

export async function deleteCategory(fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(fd.get("id"));
  const c = await db.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
  if (!c) return { error: "Category not found" };
  // Products require a category; refuse rather than silently deleting the owner's products.
  if (c._count.products > 0) return { error: `Move or delete the ${c._count.products} product(s) in “${c.name}” first.` };
  await db.category.delete({ where: { id } }); // gallery items in this category become uncategorised
  await deleteMediaIfUnused(c.imageId);
  await logActivity("Deleted category", c.name);
  refreshSite();
  return { ok: true, message: "Category deleted" };
}

export async function moveCategory(fd: FormData) {
  await requireAdmin();
  const c = await db.category.findUnique({ where: { id: String(fd.get("id")) } });
  if (!c) return;
  await moveItem("category", c.id, fd.get("dir") === "up" ? -1 : 1, { kind: c.kind });
  refreshSite();
}

export async function toggleCategory(fd: FormData) {
  await requireAdmin();
  const c = await db.category.findUnique({ where: { id: String(fd.get("id")) } });
  if (!c) return;
  await db.category.update({ where: { id: c.id }, data: { isVisible: !c.isVisible } });
  await logActivity(c.isVisible ? "Hid category" : "Showed category", c.name);
  refreshSite();
}
