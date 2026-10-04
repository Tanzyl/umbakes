import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/db";
import { mediaUrl } from "@/lib/media";
import { ActionForm, Field, ImageField, QuickAction, SubmitButton, TextArea, Toggle } from "@/components/admin/forms";
import { Badge, PageTitle } from "@/components/admin/ui";
import { moveSection, saveSection, toggleSection } from "./actions";

export const metadata = { title: "Homepage" };

type Fields = { name: string; subtitle?: string; body?: string; cta?: string; ctaHref?: boolean; secondary?: string; image?: string; note?: React.ReactNode };

/** What each homepage block lets the owner edit. Content lists come from elsewhere in the admin. */
const CONFIG: Record<string, Fields> = {
  hero: { name: "Hero (top banner)", subtitle: "Small script line above the headline", body: "Supporting text", cta: "Main button label", ctaHref: true, secondary: "WhatsApp button label", image: "Hero image", note: "If no image is set, the first featured cake photo is used." },
  featuredCakes: { name: "Featured Custom Cakes", subtitle: "Intro text", cta: "Link label", ctaHref: true, note: <>Shows custom cakes marked <strong>Featured</strong> in <Link className="underline" href="/admin/products?filter=featured">Products</Link>.</> },
  menu: { name: "Explore Our Menu", subtitle: "Intro text", note: <>Shows Menu categories set to “Show on homepage” in <Link className="underline" href="/admin/categories">Categories</Link>.</> },
  popular: { name: "Popular & New", subtitle: "Intro text", note: "Shows products marked Popular, New arrival or Seasonal special." },
  occasions: { name: "Special Occasions", subtitle: "Intro text", cta: "Call-to-action heading", secondary: "WhatsApp button label", body: "Call-to-action text", note: "Shows Custom Cake categories set to “Show on homepage”." },
  gallery: { name: "Cake Inspiration Gallery", subtitle: "Intro text", cta: "Button label", note: <>Shows designs from the <Link className="underline" href="/admin/gallery">Gallery</Link>. Featured designs come first.</> },
  about: { name: "About Us", subtitle: "Lead paragraph", body: "Your story", cta: "Button label", ctaHref: true, image: "Owner / baker photo", note: "Also used on the About page. Only state facts you're happy to publish." },
  howToOrder: { name: "How to Order", subtitle: "Intro text" },
  reviews: { name: "Customer Reviews", subtitle: "Intro text", note: <>Only shows <Link className="underline" href="/admin/reviews">approved reviews</Link>. Hidden automatically when there are none.</> },
  instagram: { name: "Instagram", subtitle: "Intro text", cta: "Follow button label", note: <>Photos are managed in <Link className="underline" href="/admin/instagram">Instagram</Link>. Profile link is in Settings.</> },
};

export default async function HomepageAdmin() {
  const sections = await db.homepageSection.findMany({ orderBy: { sortOrder: "asc" }, include: { image: true } });
  return (
    <>
      <PageTitle title="Homepage" description="Edit the text and images of each homepage section, switch sections on or off, and change their order." />
      <ol className="space-y-3">
        {sections.map((s, i) => {
          const f = CONFIG[s.key] ?? { name: s.key };
          return (
            <li key={s.key}>
              <details className="group rounded-2xl border border-line bg-ivory open:shadow-soft">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:px-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-brand">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{f.name}</span>
                    <span className="block truncate text-sm text-muted">{s.title}</span>
                  </span>
                  {!s.isVisible && <Badge tone="amber">Hidden</Badge>}
                  <ChevronDown className="size-5 text-muted transition group-open:rotate-180" aria-hidden />
                </summary>
                <div className="border-t border-line p-4 sm:p-6">
                  {f.note && <p className="mb-5 rounded-xl bg-brand-soft p-3 text-sm text-ink/80">{f.note}</p>}
                  <ActionForm action={saveSection.bind(null, s.key)} className="space-y-5">
                    <Field name="title" label="Heading" defaultValue={s.title} />
                    {f.subtitle && <TextArea name="subtitle" label={f.subtitle} defaultValue={s.subtitle} rows={2} />}
                    {!f.subtitle && <input type="hidden" name="subtitle" value={s.subtitle} />}
                    {f.body ? <TextArea name="body" label={f.body} defaultValue={s.body} rows={4} /> : <input type="hidden" name="body" value={s.body} />}
                    <div className="grid gap-5 sm:grid-cols-2">
                      {f.cta ? <Field name="ctaLabel" label={f.cta} defaultValue={s.ctaLabel} /> : <input type="hidden" name="ctaLabel" value={s.ctaLabel} />}
                      {f.ctaHref ? <Field name="ctaHref" label="Button link" defaultValue={s.ctaHref} placeholder="/cakes" /> : <input type="hidden" name="ctaHref" value={s.ctaHref} />}
                      {f.secondary ? <Field name="secondaryLabel" label={f.secondary} defaultValue={s.secondaryLabel} /> : <input type="hidden" name="secondaryLabel" value={s.secondaryLabel} />}
                    </div>
                    {f.image && <ImageField key={s.image?.id ?? "none"} name="image" label={f.image} current={s.image ? { src: mediaUrl(s.image.path), alt: s.image.alt } : null} />}
                    <Toggle key={String(s.isVisible)} name="isVisible" label="Show this section on the homepage" defaultChecked={s.isVisible} />
                    <div className="flex justify-end"><SubmitButton>Save section</SubmitButton></div>
                  </ActionForm>
                </div>
              </details>
              <div className="mt-1.5 flex justify-end gap-1">
                <QuickAction action={moveSection} hidden={{ key: s.key, dir: "up" }} label="Move section up"><ArrowUp className="size-4" /></QuickAction>
                <QuickAction action={moveSection} hidden={{ key: s.key, dir: "down" }} label="Move section down"><ArrowDown className="size-4" /></QuickAction>
                <QuickAction action={toggleSection} hidden={{ key: s.key }} label={s.isVisible ? "Hide section" : "Show section"}>{s.isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}</QuickAction>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
