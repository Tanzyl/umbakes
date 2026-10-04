import Image from "next/image";
import type { Settings } from "@/lib/data";
import { mediaUrl } from "@/lib/media";

/** The uploaded logo, or an SVG recreation of the UMBAKES badge until one is uploaded. */
export function Logo({ settings, size = 52 }: { settings: Pick<Settings, "logo" | "businessName" | "tagline">; size?: number }) {
  if (settings.logo) {
    return (
      <Image
        src={mediaUrl(settings.logo.path)}
        alt={`${settings.businessName} logo`}
        width={size}
        height={size}
        className="rounded-full"
        priority
      />
    );
  }
  return <BadgeMark size={size} label={`${settings.businessName} logo`} />;
}

export function BadgeMark({ size = 52, label }: { size?: number; label: string }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={label}>
      <circle cx="60" cy="60" r="58" fill="var(--brand)" />
      <circle cx="60" cy="60" r="51" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="2 3" />
      <text x="60" y="58" textAnchor="middle" fill="#fff" fontFamily="var(--font-cormorant), Georgia, serif" fontWeight="700" fontSize="25" letterSpacing="1">
        UM BAKES
      </text>
      <text x="60" y="76" textAnchor="middle" fill="#fff" fillOpacity=".85" fontFamily="var(--font-allura), cursive" fontSize="15">
        Baking Life Sweet
      </text>
    </svg>
  );
}
