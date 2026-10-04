import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "./db";

/** What every admin server action returns to its form. */
export type ActionState = { ok?: boolean; message?: string; error?: string; fieldErrors?: Record<string, string[] | undefined> } | null;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Zod helpers for FormData: checkboxes, optional numbers, trimmed strings. */
export const zf = {
  text: (max = 200) => z.string().trim().max(max).default(""),
  required: (label: string, max = 200) => z.string().trim().min(1, `${label} is required`).max(max),
  bool: () => z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean()),
  optInt: () =>
    z.preprocess(
      (v) => (v === "" || v == null ? null : Number(String(v).replace(/[,\s]/g, ""))),
      z.number().int("Use a whole number").min(0).max(10_000_000).nullable(),
    ),
  slug: () =>
    z
      .string()
      .trim()
      .max(80)
      .transform((v) => slugify(v))
      .default(""),
};

export function parseForm<T extends z.ZodTypeAny>(schema: T, fd: FormData) {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string" && !k.startsWith("$ACTION")) obj[k] = v;
  return schema.safeParse(obj) as z.ZodSafeParseResult<z.infer<T>>;
}

export const invalid = (error: z.ZodError): ActionState => ({
  error: "Please check the highlighted fields.",
  fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[]>,
});

export async function logActivity(action: string, target: string) {
  await db.activityLog.create({ data: { action, target: target.slice(0, 200) } });
}

/** Refresh every page that might show admin-edited content. */
export const refreshSite = () => revalidatePath("/", "layout");

/** Next free reference like CAKE-104 / ITEM-012 / GAL-007. */
export async function nextRef(prefix: string, existing: () => Promise<{ ref: string }[]>) {
  const max = (await existing())
    .map((r) => Number(r.ref.split("-").pop()))
    .filter(Number.isFinite)
    .reduce((a, b) => Math.max(a, b), 100);
  return `${prefix}-${max + 1}`;
}

export const isUniqueError = (e: unknown) => (e as { code?: string })?.code === "P2002";

type Orderable = "category" | "product" | "galleryItem" | "review" | "instagramPost";

/**
 * Moves an item one step up/down among its siblings, then rewrites sortOrder 0..n so
 * gaps and duplicates heal themselves.
 */
export async function moveItem(model: Orderable, id: string, dir: -1 | 1, scope: Record<string, unknown> = {}) {
  // ponytail: loads all siblings; fine for a bakery catalogue (hundreds of rows), paginate if it ever grows to thousands
  const delegate = db[model] as unknown as {
    findMany: (a: object) => Promise<{ id: string }[]>;
    update: (a: object) => Promise<unknown>;
  };
  const rows = await delegate.findMany({ where: scope, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], select: { id: true } });
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await db.$transaction(rows.map((r, n) => delegate.update({ where: { id: r.id }, data: { sortOrder: n } }) as never));
}
