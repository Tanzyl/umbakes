import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/site/Logo";
import { logout } from "../login/actions";

export const metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, s] = await Promise.all([requireAdmin(), getSettings()]);
  return (
    <div className="min-h-dvh bg-[#f6f3ee] lg:grid lg:grid-cols-[250px_1fr]">
      <AdminNav logo={<Logo settings={s} size={40} />} name={s.businessName} email={admin.email} logout={logout} />
      <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
