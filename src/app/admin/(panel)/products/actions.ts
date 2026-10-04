"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleImageList, imageListMediaIds } from "@/lib/admin-images";
import { invalid, isUniqueError, logActivity, moveItem, nextRef, parseForm, refreshSite, slugify, zf, type ActionState } from "@/lib/admin";
import { deleteMediaIfUnused, UploadError } from "@/lib/media";

const schema = z.object({
  name: zf.required("Name", 120),
  slug: zf.slug(),
  ref: z.string().trim().toUpperCase().max(30).regex(/^[A-Z0-9-]*$/, "Use letters, numbers and hyphens only").default(""),
  categoryId: zf.required("Category", 40),
  description: zf.text(1000),
  customization: zf.text(1000),
  price: zf.optInt(),
  priceIsStarting: zf.bool(),
  isFeatured: zf.bool(),
  isPopular: zf.bool(),
  isNew: zf.bool(),
  isSeasonal: zf.bool(),
  isAvailable: zf.bool(),
  isPublished: zf.bool(),
  whatsappNote: zf.text(300),
});

export async function saveProduct(id: string | null, _: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(schema, fd);
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const category = await db.category.findUnique({ where: { id: d.categoryId } });
  if (!category) return { error: "Choose a category", fieldErrors: { categoryId: ["Choose a category"] } };

  const slug = d.slug || slugify(d.name);
  const ref = d.ref || (await nextRef(category.kind === "CAKE" ? "CAKE" : "ITEM", () => db.product.findMany({ select: { ref: true } })));
  const data = { ...d, slug, ref };

  let savedId = id;
  try {
    if (id) {
      await db.product.update({ where: { id }, data });
    } else {
      const last = await db.product.aggregate({ _max: { sortOrder: true } });
      savedId = (await db.product.create({ data: { ...data, sortOrder: (last._max.sortOrder ?? -1) + 1 } })).id;
    }
    await handleImageList(fd, "product", savedId!, "products", d.name);
    await logActivity(id ? "Updated product" : "Created product", d.name);
  } catch (e) {
    if (isUniqueError(e)) {
      const target = String((e as { meta?: { target?: unknown } }).meta?.target ?? "");
      return target.includes("ref")
        ? { error: "That reference ID is already used.", fieldErrors: { ref: ["Already used by another product"] } }
        : { error: "That web address is already used.", fieldErrors: { slug: ["Already used by another product"] } };
    }
    if (e instanceof UploadError) {
      // Product details were saved; only the photo failed. Send the owner to the saved record.
      if (!id && savedId) redirect(`/admin/products/${savedId}?uploadError=${encodeURIComponent(e.message)}`);
      return { error: e.message };
    }
    throw e;
  }
  refreshSite();
  if (!id) redirect(`/admin/products/${savedId}?created=1`);
  return { ok: true, message: "Product saved" };
}

export async function deleteProduct(fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(fd.get("id"));
  const p = await db.product.findUnique({ where: { id } });
  if (!p) return { error: "Product not found" };
  const mediaIds = await imageListMediaIds("product", id);
  await db.product.delete({ where: { id } }); // cascades ProductImage rows
  for (const m of mediaIds) await deleteMediaIfUnused(m);
  await logActivity("Deleted product", p.name);
  refreshSite();
  return { ok: true, message: "Product deleted" };
}

export async function deleteProductAndReturn(fd: FormData) {
  const res = await deleteProduct(fd);
  if (res?.error) return res;
  redirect("/admin/products");
}

export async function moveProduct(fd: FormData) {
  await requireAdmin();
  await moveItem("product", String(fd.get("id")), fd.get("dir") === "up" ? -1 : 1);
  refreshSite();
}

export async function toggleProduct(fd: FormData) {
  await requireAdmin();
  const p = await db.product.findUnique({ where: { id: String(fd.get("id")) } });
  if (!p) return;
  const field = fd.get("field") === "isFeatured" ? "isFeatured" : "isPublished";
  await db.product.update({ where: { id: p.id }, data: { [field]: !p[field] } });
  await logActivity(`${field === "isFeatured" ? (p.isFeatured ? "Unfeatured" : "Featured") : p.isPublished ? "Hid" : "Published"} product`, p.name);
  refreshSite();
}
