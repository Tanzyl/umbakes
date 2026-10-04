import { getSettings } from "@/lib/data";
import { mediaUrl } from "@/lib/media";
import { ActionForm, Field, ImageField, SubmitButton, TextArea, Toggle } from "@/components/admin/forms";
import { PageTitle, Panel } from "@/components/admin/ui";
import { changePassword, saveSettings } from "./actions";

export const metadata = { title: "Settings" };

const img = (m: { path: string; alt: string } | null) => (m ? { src: mediaUrl(m.path), alt: m.alt } : null);

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <>
      <PageTitle title="Settings" description="Business details, WhatsApp ordering, branding and search engine settings. Changes apply to the website immediately." />
      <ActionForm action={saveSettings} className="space-y-6">
        <Panel title="WhatsApp ordering">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="whatsappNumber" label="WhatsApp number" defaultValue={s.whatsappNumber ? `+${s.whatsappNumber}` : ""} placeholder="+92 300 1234567" hint="Every order button on the site uses this number." inputMode="tel" />
            <div className="sm:col-span-2"><TextArea name="whatsappGreeting" label="Default greeting" defaultValue={s.whatsappGreeting} rows={2} hint="Pre-filled when customers tap the general WhatsApp buttons." /></div>
          </div>
        </Panel>

        <Panel title="Business details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="businessName" label="Business name" defaultValue={s.businessName} required />
            <Field name="tagline" label="Tagline" defaultValue={s.tagline} />
            <Field name="instagramUrl" label="Instagram profile link" defaultValue={s.instagramUrl} />
            <Field name="phone" label="Phone (optional)" defaultValue={s.phone} />
            <Field name="email" label="Email (optional)" type="email" defaultValue={s.email} />
            <div />
            <TextArea name="location" label="Location (optional)" defaultValue={s.location} rows={2} hint="Shown only if filled in." />
            <TextArea name="hours" label="Opening hours (optional)" defaultValue={s.hours} rows={2} hint="Shown only if filled in." />
            <div className="sm:col-span-2"><TextArea name="footerText" label="Footer text" defaultValue={s.footerText} rows={2} /></div>
          </div>
        </Panel>

        <Panel title="Branding">
          <div className="space-y-6">
            <ImageField key={s.logo?.id ?? "none"} name="logo" label="Logo" current={img(s.logo)} hint="A square image works best. Shown in a circle." />
            <ImageField key={s.favicon?.id ?? "none"} name="favicon" label="Browser tab icon (favicon)" current={img(s.favicon)} hint="Square. Uses the logo if empty." />
            <div className="grid gap-5 sm:grid-cols-2">
              <ColorField name="primaryColor" label="Main brand colour" value={s.primaryColor} hint="Buttons, headings, footer" />
              <ColorField name="accentColor" label="Accent colour" value={s.accentColor} hint="Small highlights and labels" />
            </div>
            <p className="text-xs text-muted">Lighter and darker shades are created automatically. Keep the main colour dark enough for white text to stay readable.</p>
          </div>
        </Panel>

        <Panel title="Search engines & sharing">
          <div className="space-y-5">
            <Field name="seoTitle" label="Site title" defaultValue={s.seoTitle} maxLength={70} hint="Shown in Google results and browser tabs (up to 70 characters)." />
            <TextArea name="seoDescription" label="Site description" defaultValue={s.seoDescription} rows={2} maxLength={170} hint="Up to 170 characters." />
            <ImageField key={s.ogImage?.id ?? "none"} name="ogImage" label="Social sharing image" current={img(s.ogImage)} hint="Shown when the site is shared on WhatsApp/Facebook. Landscape 1200×630 works best." />
          </div>
        </Panel>

        <Panel title="Website availability">
          <Toggle key={String(s.maintenanceMode)} name="maintenanceMode" label="Maintenance mode" hint="Visitors see a short “we'll be back soon” page with your WhatsApp button. You can still browse while signed in." defaultChecked={s.maintenanceMode} />
        </Panel>

        <div className="flex justify-end"><SubmitButton>Save settings</SubmitButton></div>
      </ActionForm>

      <Panel title="Change password" className="mt-10">
        <ActionForm action={changePassword} resetOnSuccess className="grid gap-5 sm:grid-cols-3">
          <Field name="current" label="Current password" type="password" autoComplete="current-password" />
          <Field name="next" label="New password" type="password" autoComplete="new-password" />
          <Field name="confirm" label="Repeat new password" type="password" autoComplete="new-password" />
          <div className="flex justify-end sm:col-span-3"><SubmitButton className="btn-outline">Change password</SubmitButton></div>
        </ActionForm>
      </Panel>
    </>
  );
}

function ColorField({ name, label, value, hint }: { name: string; label: string; value: string; hint: string }) {
  return (
    <div>
      <label className="text-sm font-medium" htmlFor={name}>{label}</label>
      <div className="mt-1.5 flex items-center gap-3">
        <input id={name} type="color" name={name} defaultValue={value} className="h-11 w-16 cursor-pointer rounded-lg border border-line bg-white p-1" />
        <span className="text-xs text-muted">{hint}</span>
      </div>
    </div>
  );
}
