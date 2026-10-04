import { CakeSlice } from "lucide-react";
import { getAdmin } from "@/lib/auth";
import { generalWaHref, getCategories, getSettings } from "@/lib/data";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Logo } from "@/components/site/Logo";
import { Navbar } from "@/components/site/Navbar";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [s, waHref, categories, admin] = await Promise.all([getSettings(), generalWaHref(), getCategories("MENU"), getAdmin()]);

  if (s.maintenanceMode && !admin) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
        <Logo settings={s} size={96} />
        <h1 className="text-4xl font-semibold">We&apos;re freshening things up</h1>
        <p className="max-w-md text-muted">Our website is being updated. You can still order on WhatsApp in the meantime.</p>
        <a href={waHref} className="btn-wa">Order on WhatsApp</a>
        <CakeSlice className="size-6 text-accent" aria-hidden />
      </main>
    );
  }

  return (
    <>
      {admin && s.maintenanceMode && (
        <p className="bg-accent-soft py-2 text-center text-sm text-accent-ink">Maintenance mode is on. Visitors see a holding page.</p>
      )}
      <Navbar logo={<Logo settings={s} size={48} />} name={s.businessName} waHref={waHref} />
      <main id="main" className="flex-1">{children}</main>
      <Footer settings={s} categories={categories} waHref={waHref} />
      <FloatingWhatsApp href={waHref} />
    </>
  );
}
