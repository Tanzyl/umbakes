import { CatalogIndex } from "@/components/site/Catalog";


export const metadata = { title: "Menu", alternates: { canonical: "/menu" } };

export default async function Page() {
  
  return (
    <CatalogIndex kind="MENU" intro="Cupcakes, brownies, mousse, cookies, tea snacks and more, baked fresh to order.">
    </CatalogIndex>
  );
}
