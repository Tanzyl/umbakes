"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearRateLimit, createSession, destroySession, rateLimit, verifyLogin } from "@/lib/auth";
import type { ActionState } from "@/lib/admin";

const schema = z.object({ email: z.string().trim().email().max(200), password: z.string().min(1).max(200) });

export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  const parsed = schema.safeParse({ email: fd.get("email"), password: fd.get("password") });
  if (!parsed.success) return { error: "Enter your email and password." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const key = `${ip}:${parsed.data.email.toLowerCase()}`;
  const limit = rateLimit(key);
  if (!limit.ok) return { error: `Too many attempts. Try again in ${limit.retryInMin} minutes.` };

  const user = await verifyLogin(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Email or password is incorrect." };

  clearRateLimit(key);
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
