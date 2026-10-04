import { ProductView, productMetadata } from "@/components/site/Catalog";

export async function generateMetadata({ params }: PageProps<"/menu/[slug]/[product]">) {
  const { slug, product } = await params;
  return productMetadata("MENU", slug, product);
}

export default async function Page({ params }: PageProps<"/menu/[slug]/[product]">) {
  const { slug, product } = await params;
  return <ProductView kind="MENU" cat={slug} slug={product} />;
}
