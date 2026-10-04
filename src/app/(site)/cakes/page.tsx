import { CatalogIndex } from "@/components/site/Catalog";
import { CustomCakeForm } from "@/components/site/CustomCakeForm";
import { getCategories, getSettings } from "@/lib/data";

export const metadata = { title: "Custom Cakes", alternates: { canonical: "/cakes" } };

export default async function Page() {
  const [s, cats] = await Promise.all([getSettings(), getCategories("CAKE")]);
  return (
    <CatalogIndex kind="CAKE" intro="Celebration cakes designed around your story: birthdays, weddings, bridal showers and every moment worth marking.">
      <section id="custom-cake" className="bg-ivory py-20">
        <div className="container-x max-w-4xl">
          <p className="eyebrow mb-3">Something completely new?</p>
          <h2 className="text-4xl font-semibold sm:text-5xl">Design your own cake</h2>
          <p className="mt-4 mb-10 text-muted">Tell us what you have in mind and we&apos;ll continue on WhatsApp.</p>
          <CustomCakeForm waNumber={s.whatsappNumber} businessName={s.businessName} occasions={cats.map((c) => c.name)} />
        </div>
      </section>
    </CatalogIndex>
  );
}
