import { CakeSlice } from "lucide-react";

/** Shown where the owner hasn't uploaded a photo yet. Deliberately not stock photography. */
export function PhotoPlaceholder({ label = "Photo coming soon", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,var(--color-accent-soft),var(--color-brand-soft))] text-brand/70 ${className}`}>
      <CakeSlice className="size-9" strokeWidth={1.3} aria-hidden />
      <span className="font-script text-2xl">{label}</span>
    </div>
  );
}
