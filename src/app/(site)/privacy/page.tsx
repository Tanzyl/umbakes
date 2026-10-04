import { PageHeader } from "@/components/site/Catalog";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Privacy Policy" />
      <article className="container-x max-w-3xl space-y-5 pb-24 text-ink/85 [&_h2]:mt-10 [&_h2]:text-3xl">
        <p>This website lets you browse {s.businessName}&apos;s cakes and bakes and get in touch. We collect as little as possible.</p>
        <h2>What we collect</h2>
        <p>
          You don&apos;t need an account. The order buttons and custom cake form don&apos;t store anything on our servers. They open WhatsApp with
          a pre-filled message, and you choose whether to send it.
        </p>
        <h2>WhatsApp and Instagram</h2>
        <p>When you message us on WhatsApp or visit our Instagram, their own privacy policies apply. We use what you send us only to discuss and fulfil your order.</p>
        <h2>Cookies</h2>
        <p>Public pages don&apos;t use tracking or advertising cookies. A single security cookie is used only when our staff sign in to manage the website.</p>
        <h2>Questions</h2>
        <p>
          For any privacy question, message us on WhatsApp
          {s.email ? (
            <>
              {" "}or email <a className="text-brand underline" href={`mailto:${s.email}`}>{s.email}</a>
            </>
          ) : null}
          .
        </p>
      </article>
    </>
  );
}
