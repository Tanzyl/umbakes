import { CategoryView, categoryMetadata } from "@/components/site/Catalog";

export async function generateMetadata({ params }: PageProps<"/menu/[slug]">) {
  return categoryMetadata("MENU", (await params).slug);
}

export default async function Page({ params }: PageProps<"/menu/[slug]">) {
  return <CategoryView kind="MENU" slug={(await params).slug} />;
}
