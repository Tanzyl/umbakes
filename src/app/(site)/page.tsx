import { generalWaHref, getCategories, getGallery, getInstagramPosts, getProducts, getReviews, getSections, getSettings } from "@/lib/data";
import {
  AboutSection,
  FeaturedCakes,
  GallerySection,
  Hero,
  HowToOrder,
  InstagramSection,
  MenuSection,
  OccasionsSection,
  PopularSection,
  ReviewsSection,
} from "@/components/site/HomeSections";

export default async function HomePage() {
  const [settings, sections, waHref, featured, popular, cakeCats, menuCats, gallery, reviews, posts] = await Promise.all([
    getSettings(),
    getSections(),
    generalWaHref(),
    getProducts({ isFeatured: true, category: { kind: "CAKE", isVisible: true } }, 6),
    getProducts({ OR: [{ isPopular: true }, { isNew: true }, { isSeasonal: true }] }, 8),
    getCategories("CAKE"),
    getCategories("MENU"),
    getGallery({ take: 12 }),
    getReviews(),
    getInstagramPosts(),
  ]);
  const discussHref = await generalWaHref(`Hi ${settings.businessName}! I have a special cake design in mind and would like to discuss it.`);
  const fallbackHero = featured.find((p) => p.images[0])?.images[0] ?? null;

  return (
    <>
      {sections
        .filter((s) => s.isVisible)
        .map((s) => {
          switch (s.key) {
            case "hero":
              return <Hero key={s.key} section={s} waHref={waHref} fallbackImage={fallbackHero} />;
            case "featuredCakes":
              return <FeaturedCakes key={s.key} section={s} products={featured} />;
            case "menu":
              return <MenuSection key={s.key} section={s} categories={menuCats.filter((c) => c.showOnHome)} />;
            case "popular":
              return <PopularSection key={s.key} section={s} products={popular} />;
            case "occasions":
              return <OccasionsSection key={s.key} section={s} categories={cakeCats.filter((c) => c.showOnHome)} waHref={discussHref} />;
            case "gallery":
              return <GallerySection key={s.key} section={s} items={gallery} />;
            case "about":
              return <AboutSection key={s.key} section={s} settings={settings} />;
            case "howToOrder":
              return <HowToOrder key={s.key} section={s} />;
            case "reviews":
              return <ReviewsSection key={s.key} section={s} reviews={reviews} />;
            case "instagram":
              return <InstagramSection key={s.key} section={s} posts={posts} url={settings.instagramUrl} />;
            default:
              return null;
          }
        })}
    </>
  );
}
