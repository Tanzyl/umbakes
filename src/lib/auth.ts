import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const SESSION_COOKIE = "umb_session";
const SESSION_DAYS = 14;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.session.create({ data: { id: hashToken(token), userId, expiresAt } });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { id: hashToken(token) } });
  jar.delete(SESSION_COOKIE);
}

/** Current admin or null. Cached per request. */
export const getAdmin = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { id: hashToken(token) },
    include: { user: { select: { id: true, email: true, name: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
});

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function verifyLogin(email: string, password: string) {
  const user = await db.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  // Always run bcrypt so response time doesn't reveal whether the email exists.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
  return ok && user ? user : null;
}

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

// ponytail: in-memory limiter, per process. Move to Redis/DB if the app ever runs on several instances.
const attempts = new Map<string, { count: number; resetAt: number }>();
export function rateLimit(key: string, max = 5, windowMs = 15 * 60_000) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  entry.count++;
  return { ok: entry.count <= max, retryInMin: Math.ceil((entry.resetAt - now) / 60_000) };
}
export const clearRateLimit = (key: string) => attempts.delete(key);
