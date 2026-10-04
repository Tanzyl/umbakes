"use server";
import { z } from "zod";
import { getAdmin, hashPassword, requireAdmin, verifyLogin } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleSingleImage } from "@/lib/admin-images";
import { invalid, logActivity, parseForm, refreshSite, zf, type ActionState } from "@/lib/admin";
import { UploadError } from "@/lib/media";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

const hex = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a colour like #1f5c58");

const schema = z.object({
  businessName: zf.required("Business name", 60),
  tagline: zf.text(80),
  whatsappNumber: z
    .string()
    .trim()
    .max(25)
    .transform((v) => (v ? normalizeWhatsAppNumber(v) : ""))
    .refine((v) => v === "" || /^\d{10,15}$/.test(v), "Enter a full number, e.g. +92 300 1234567"),
  whatsappGreeting: zf.text(300),
  instagramUrl: z.string().trim().max(200).refine((v) => v === "" || /^https:\/\//.test(v), "Must start with https://").default(""),
  phone: zf.text(40),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(120)]).default(""),
  location: zf.text(300),
  hours: zf.text(300),
  seoTitle: zf.text(70),
  seoDescription: zf.text(170),
  footerText: zf.text(300),
  primaryColor: hex,
  accentColor: hex,
  maintenanceMode: zf.bool(),
});

export async function saveSettings(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(schema, fd);
  if (!parsed.success) return invalid(parsed.error);
  const current = await db.websiteSettings.findUniqueOrThrow({ where: { id: 1 } });
  try {
    const logo = await handleSingleImage(fd, "logo", "site", current.logoId);
    const favicon = await handleSingleImage(fd, "favicon", "site", current.faviconId);
    const og = await handleSingleImage(fd, "ogImage", "site", current.ogImageId);
    await db.websiteSettings.update({ where: { id: 1 }, data: { ...parsed.data, logoId: logo.id, faviconId: favicon.id, ogImageId: og.id } });
    await Promise.all([logo.cleanup(), favicon.cleanup(), og.cleanup()]);
  } catch (e) {
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
  await logActivity("Updated settings", "Website settings");
  refreshSite();
  return { ok: true, message: "Settings saved" };
}

const pwSchema = z
  .object({ current: z.string().min(1, "Enter your current password"), next: z.string().min(10, "Use at least 10 characters").max(200), confirm: z.string() })
  .refine((v) => v.next === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

export async function changePassword(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const admin = (await getAdmin())!;
  const parsed = parseForm(pwSchema, fd);
  if (!parsed.success) return invalid(parsed.error);
  if (!(await verifyLogin(admin.email, parsed.data.current))) return { error: "Current password is incorrect", fieldErrors: { current: ["Incorrect password"] } };
  await db.adminUser.update({ where: { id: admin.id }, data: { passwordHash: await hashPassword(parsed.data.next) } });
  await logActivity("Changed password", admin.email);
  return { ok: true, message: "Password changed" };
}
