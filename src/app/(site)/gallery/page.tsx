import { PageHeader } from "@/components/site/Catalog";
import { Gallery } from "@/components/site/Gallery";
import { getGallery } from "@/lib/data";

export const metadata = {
  title: "Our Gallery",
  description: "A portfolio of custom cakes by UMBAKES. Tap any design to order one like it on WhatsApp.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage({ searchParams }: PageProps<"/gallery">) {
  const { design } = await searchParams;
  const items = await getGallery();
  return (
    <>
      <PageHeader
        eyebrow="Cake inspiration"
        title="Our Gallery"
        subtitle="Every design here was made for someone's special moment. Tap a cake to see it up close, or order one like it."
      />
      <section className="container-x pb-24">
        {items.length ? (
          <Gallery items={items} initialRef={typeof design === "string" ? design : undefined} />
        ) : (
          <p className="text-muted">Our gallery is being curated. Check back soon!</p>
        )}
      </section>
    </>
  );
}
