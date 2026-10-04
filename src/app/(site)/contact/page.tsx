import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/Catalog";
import { CustomCakeForm } from "@/components/site/CustomCakeForm";
import { InstagramIcon, WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { generalWaHref, getCategories, getSettings } from "@/lib/data";

export const metadata = { title: "Contact", description: "Order or ask about a custom cake on WhatsApp.", alternates: { canonical: "/contact" } };

export default async function ContactPage() {
  const [s, waHref, cats] = await Promise.all([getSettings(), generalWaHref(), getCategories("CAKE")]);
  // Only details the owner has supplied in Settings are shown.
  const rows = [
    s.phone && { icon: Phone, label: "Phone", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    s.email && { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    s.location && { icon: MapPin, label: "Location", value: s.location },
    s.hours && { icon: Clock, label: "Hours", value: s.hours },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHeader eyebrow="Let's make something sweet" title="Contact Us" subtitle="WhatsApp is the quickest way to reach us for orders, prices and availability." />
      <section className="container-x grid gap-8 pb-16 lg:grid-cols-[1fr_1.6fr]">
        <div className="card flex h-fit flex-col gap-4 p-8">
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-wa w-full">
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
          {s.instagramUrl && (
            <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
              <InstagramIcon className="size-4.5" /> Instagram
            </a>
          )}
          {rows.length > 0 && (
            <dl className="mt-2 space-y-5 border-t border-line pt-6">
              {rows.map((r) => (
                <div key={r.label} className="flex gap-3">
                  <r.icon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  <div>
                    <dt className="text-sm text-muted">{r.label}</dt>
                    <dd className="whitespace-pre-line">{r.href ? <a href={r.href} className="hover:text-brand">{r.value}</a> : r.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div id="custom-cake" className="card scroll-mt-24 p-6 sm:p-10">
          <h2 className="text-4xl font-semibold">Custom cake inquiry</h2>
          <p className="mt-2 mb-8 text-muted">Share a few details and we&apos;ll open WhatsApp with your message ready to send.</p>
          <CustomCakeForm waNumber={s.whatsappNumber} businessName={s.businessName} occasions={cats.map((c) => c.name)} />
        </div>
      </section>
    </>
  );
}
