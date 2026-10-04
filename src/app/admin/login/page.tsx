import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { ActionForm, Field, SubmitButton } from "@/components/admin/forms";
import { Logo } from "@/components/site/Logo";
import { login } from "./actions";

export const metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  const s = await getSettings();
  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand-soft px-4 py-12">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo settings={s} size={72} />
          <h1 className="text-3xl font-semibold">Admin sign in</h1>
          <p className="text-sm text-muted">Manage your {s.businessName} website</p>
        </div>
        <ActionForm action={login} className="space-y-4">
          <Field name="email" label="Email" type="email" autoComplete="username" required />
          <Field name="password" label="Password" type="password" autoComplete="current-password" required />
          <SubmitButton className="btn-primary w-full">Sign in</SubmitButton>
        </ActionForm>
      </div>
    </main>
  );
}
