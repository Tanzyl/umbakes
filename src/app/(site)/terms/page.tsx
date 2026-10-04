import { PageHeader } from "@/components/site/Catalog";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Terms & Conditions" />
      <article className="container-x max-w-3xl space-y-5 pb-24 text-ink/85 [&_h2]:mt-10 [&_h2]:text-3xl">
        <h2>Orders</h2>
        <p>
          Orders are placed and confirmed through WhatsApp. An order is confirmed only once {s.businessName} has agreed the design, size, flavour,
          date, price and delivery or pickup with you.
        </p>
        <h2>Designs and prices</h2>
        <p>
          Photos show cakes we have made before. Every cake is handmade, so small variations are natural. Prices on the website are a guide, and
          &ldquo;From&rdquo; prices depend on size and customisation. Your final price is confirmed on WhatsApp.
        </p>
        <h2>Allergies</h2>
        <p>Please tell us about any allergies or dietary requirements before you confirm your order.</p>
      </article>
    </>
  );
}
