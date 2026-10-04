import { CategoryView, categoryMetadata } from "@/components/site/Catalog";

export async function generateMetadata({ params }: PageProps<"/cakes/[slug]">) {
  return categoryMetadata("CAKE", (await params).slug);
}

export default async function Page({ params }: PageProps<"/cakes/[slug]">) {
  return <CategoryView kind="CAKE" slug={(await params).slug} />;
}
