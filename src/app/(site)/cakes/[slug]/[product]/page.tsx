import { ProductView, productMetadata } from "@/components/site/Catalog";

export async function generateMetadata({ params }: PageProps<"/cakes/[slug]/[product]">) {
  const { slug, product } = await params;
  return productMetadata("CAKE", slug, product);
}

export default async function Page({ params }: PageProps<"/cakes/[slug]/[product]">) {
  const { slug, product } = await params;
  return <ProductView kind="CAKE" cat={slug} slug={product} />;
}
