import type { Metadata, Viewport } from "next";
import { Allura, Cormorant_Garamond, Jost } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/data";
import { mediaUrl } from "@/lib/media";
import "./globals.css";

const jost = Jost({ variable: "--font-jost", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const allura = Allura({ variable: "--font-allura", subsets: ["latin"], weight: "400" });

// Every page reads admin-editable content from the database, so render on request.
export const dynamic = "force-dynamic";

const HEX = /^#[0-9a-f]{6}$/i;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.seoTitle, template: `%s | ${s.businessName}` },
    description: s.seoDescription,
    icons: s.favicon ? { icon: mediaUrl(s.favicon.path) } : s.logo ? { icon: mediaUrl(s.logo.path) } : undefined,
    openGraph: {
      type: "website",
      siteName: s.businessName,
      title: s.seoTitle,
      description: s.seoDescription,
      images: s.ogImage ? [mediaUrl(s.ogImage.path)] : s.logo ? [mediaUrl(s.logo.path)] : undefined,
    },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = { themeColor: "#fbf7f0" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const s = await getSettings();
  const vars = {
    ...(HEX.test(s.primaryColor) ? { "--brand": s.primaryColor } : {}),
    ...(HEX.test(s.accentColor) ? { "--accent": s.accentColor } : {}),
  } as React.CSSProperties;

  return (
    <html lang="en" className={`${jost.variable} ${cormorant.variable} ${allura.variable}`}>
      <body className="flex min-h-dvh flex-col" style={vars}>
        {children}
        <Toaster position="top-center" richColors closeButton toastOptions={{ className: "font-sans" }} />
      </body>
    </html>
  );
}
