import { AboutSection, HowToOrder } from "@/components/site/HomeSections";
import { PageHeader } from "@/components/site/Catalog";
import { getSections, getSettings } from "@/lib/data";

export const metadata = { title: "About Us", alternates: { canonical: "/about" } };

export default async function AboutPage() {
  const [s, sections] = await Promise.all([getSettings(), getSections()]);
  const about = sections.find((x) => x.key === "about");
  const how = sections.find((x) => x.key === "howToOrder");
  return (
    <>
      <PageHeader eyebrow={s.tagline} title={`About ${s.businessName}`} />
      {about && <AboutSection section={about} settings={s} />}
      {how && <HowToOrder section={how} />}
    </>
  );
}
